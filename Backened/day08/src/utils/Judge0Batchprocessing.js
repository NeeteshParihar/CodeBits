

import axios from "axios";
import dotenv from 'dotenv';
import makeWait from '../utils/waitingTime.js';

dotenv.config({ path: './judge0.env' });

const key = process.env['judge_key'];
const host = process.env['host'];


export async function submitBatch(submissions) {



  const options = {
    method: 'POST',
    url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
    params: {
      base64_encoded: 'true' // we have to encode the string first in base64
    },
    headers: {
      'x-rapidapi-key': key,
      'x-rapidapi-host': host,
      'Content-Type': 'application/json'
    },

  };

  try {

    const response = await axios.request({
      ...options,
      data: {
        submissions: submissions
      }
    })


    return { internalServerError: null, tokenResponse:response.data};

  } catch (err) {
    console.log('got erro while batch submission', err);
    return {
      internalServerError: err,
    };
  }
}


async function getBatchSubmission_util(tokens) {

  const options = {
    method: 'GET',
    url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
    params: {
      tokens: tokens.join(','),
      base64_encoded: 'true',
      fields: '*'
    },
    headers: {
      'x-rapidapi-key': key,
      'x-rapidapi-host': host
    }
  };

  const response = await axios.request(options);
  return response.data;

}


export async function getBatchSubmission(tokens) {



  let submissionResult
    = [];
  let attempts = 5;

  try {

    while (tokens.length > 0 && attempts) {

      let { submissions } = await getBatchSubmission_util(tokens);


      if (attempts == 5) {
        submissionResult
          = submissions;
      } else {

        tokens = [];

        submissions.forEach((testCaseRes) => {

          if (testCaseRes.status_id < 3) {
            tokens.push(testCaseRes.token);
          } else {

            const index = submissionResult
              .findIndex(({ token }) => token === testCaseRes.token);

            if (index !== -1) {
              submissionResult
              [index] = testCaseRes;
            }
          }

        });
      }

      attempts--;
      makeWait(500);
    }



    return {
      internalServerError: null,
      results: submissionResult
    }


  } catch (err) { 


    return {
      internalServerError: err,
      results: []
    }
  }

}

