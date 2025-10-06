

import axios from "axios";

const options = {
  method: 'POST',
  url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
  params: {
    base64_encoded: 'true' // we have to encode the string first in base64
  },
  headers: {
    'x-rapidapi-key': '84a4e77199mshc9b598d7896086dp1f7d4fjsn6733e170f3c9',
    'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
    'Content-Type': 'application/json'
  },
  
};


async  function submitBatch(submissions){

    try{

        const response = await axios.request({
            ...options,
            data: {
                submissions: submissions
            }
        })

        return response.data;       

    }catch(err){
        console.log('got erro while batch submission', err);
        return null;
    }
}

export default submitBatch;