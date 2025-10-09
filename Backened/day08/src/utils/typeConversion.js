

function getBase64Str(str){

    if(!str) str = '';

    const buffer = Buffer.from(str, 'utf8');
    const base64_encoded = buffer.toString('base64');

    return base64_encoded;
}

function getUtf8FromBase64(str){
    if(!str) str = '';

    const buffer = Buffer.from(str, 'base64');
    const utf8 = buffer.toString('utf8');
    return utf8;
}

export {
    getBase64Str, getUtf8FromBase64
}