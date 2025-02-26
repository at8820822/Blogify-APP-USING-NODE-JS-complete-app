const { verifyToken } = require('../services/authentication');


function checkForAuthenticationCookie(cookieName) {
    return (req, res, next) => {
        const tokenCookieValue = req.cookies[cookieName];



        if (!tokenCookieValue) {
         
            return next();
        }

        try {
            const userPayload = verifyToken(tokenCookieValue);
            
            req.user = userPayload;
            res.locals.user = userPayload; // ✅ Add user to locals for templates
        } catch (error) {
          
            res.clearCookie(cookieName); // Remove corrupted token
        }

        return next();
    };
}


module.exports={

    checkForAuthenticationCookie,
}