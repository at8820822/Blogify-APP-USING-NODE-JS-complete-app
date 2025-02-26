
const jwt = require('jsonwebtoken');



const secret = "mysecret@123@";


//create a token for the user 
function createTokenForUser(user){
    payload = {
        _id: user._id,
        email: user.email,
        profileImageURL: user.profileImageURL,
        role: user.role,
    }

    const token = jwt.sign(payload, secret);
    return token;
}

//verify the token sent by the user
function verifyToken(token){
   const payload = jwt.verify(token, secret);
   return payload;
   
}

module.exports = {
    createTokenForUser,
    verifyToken,
}