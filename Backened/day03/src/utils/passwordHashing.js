import bcrypt from 'bcrypt';

const getHashedPassword = async (password, saltRounds = 10) => {

    const hashCode = await bcrypt.hash(password, saltRounds);
    return hashCode;

}
// we can use try catch block but we can handle it in the rotes

const checkPassword = async (password, hashCode) => {

    const isMatch = await bcrypt.compare(password, hashCode);
    return isMatch;

}

export { getHashedPassword, checkPassword};