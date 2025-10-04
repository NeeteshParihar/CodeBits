

async function giveError(){

    throw new Error("there is no error");
}

try{

    giveError();

}catch(err){

}

console.log("hello bro");