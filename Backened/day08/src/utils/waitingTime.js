
async function makeWait(millisecs){ 
    // promise state -> pending, resolved and reject

    return new Promise((res, req)=>{
        setTimeout(()=>{
            res();
        }, millisecs)
    })

}

export default makeWait;