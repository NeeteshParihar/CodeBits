import axios from "axios";
import dotenv from 'dotenv';


const originalString = `#include <iostream>
using namespace std;

int main() {
    
    int n;
    cin >> n;

    int maxi = -1;
    
    for( int i = 0; i < n; i++){

    int val;
    cin >> val;
    
    if(val > maxi) maxi = val;

    }

    cout << maxi;   

    return 0;
}`;

dotenv.config({path: './judge0.env' });
const key = process.env['judge_key'];
const host = process.env['host'];


const options = {
    method: 'POST',
    url: 'https://judge0-ce.p.rapidapi.com/submissions',
    params: {
        wait: 'false',
        fields: '*'
    },
    headers: {
        'x-rapidapi-key': key,
        'x-rapidapi-host': host,
        'Content-Type': 'application/json'
    },
    data: {
        language_id: 105,
        stdin:'6 1 2 3 4 5 6',
        source_code: originalString,
        expected_output: '6'
    }
};


async function fetchData() {
    try {
        const response = await axios.request(options);
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

// const { token } = await fetchData();

// console.log(token);

const optionsForGet = {
    method: 'GET',
    url: `https://judge0-ce.p.rapidapi.com/submissions/${'4f7425f4-deb7-4488-b2b8-3ba8cd029cd8'}`,
    params: {
        fields: '*'
    },
    headers: {
        'x-rapidapi-key': key,
        'x-rapidapi-host': host
    }
};

async function fetchData2() {
    try {
        const response = await axios.request(optionsForGet);
        console.log(response.data);

    } catch (error) {

        console.log(error);
    }
}

fetchData2();
