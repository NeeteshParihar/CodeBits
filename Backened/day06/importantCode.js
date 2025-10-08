import axios from "axios";

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



const options = {
    method: 'POST',
    url: 'https://judge0-ce.p.rapidapi.com/submissions',
    params: {
        wait: 'false',
        fields: '*'
    },
    headers: {
        'x-rapidapi-key': '84a4e77199mshc9b598d7896086dp1f7d4fjsn6733e170f3c9',
        'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
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
    url: `https://judge0-ce.p.rapidapi.com/submissions/${'99c7eee0-05db-4869-85ba-49d285d208aa'}`,
    params: {
        fields: '*'
    },
    headers: {
        'x-rapidapi-key': '84a4e77199mshc9b598d7896086dp1f7d4fjsn6733e170f3c9',
        'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
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
