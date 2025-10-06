import axios from "axios";

const originalString = `function fact(n){
    if(n == 0) return 1;
    return n*fact(n-1);
}

console.log(fact(5));`;

const buffer = Buffer.from(originalString, 'utf8');

// 2. Convert the Buffer to a Base64 encoded string
const base64EncodedString = buffer.toString('base64');

const options = {
    method: 'POST',
    url: 'https://judge0-ce.p.rapidapi.com/submissions',
    params: {
        base64_encoded: 'true',
        wait: 'false',
        fields: '*'
    },
    headers: {
        'x-rapidapi-key': '84a4e77199mshc9b598d7896086dp1f7d4fjsn6733e170f3c9',
        'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
        'Content-Type': 'application/json'
    },
    data: {
        language_id: 102,
        source_code: base64EncodedString
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

const { token } = await fetchData();

console.log(token);

const optionsForGet = {
    method: 'GET',
    url: `https://judge0-ce.p.rapidapi.com/submissions/${'6a75ee0f-3164-43bf-805a-586bc79ef39e'}`,
    params: {
        base64_encoded: 'true',
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

        const data = response.data;
        const stdout = data.stdout;

        const buffer = Buffer.from(stdout, 'base64');

        // Convert the Buffer to a string, specifying 'utf8' as the desired encoding
        const decodedString = buffer.toString('utf8');

        console.log(decodedString);

    } catch (error) {

        console.log(error);
    }
}

fetchData2();
