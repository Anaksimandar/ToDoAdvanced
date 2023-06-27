const jwt = require('jsonwebtoken');
const { User } = require('../models/user.model');

// Verify Refresh Token Middleware (which will be verifying the session)
const verifySession = (req,res,next)=>{
    let refreshToken = req.header('x-refresh-token');
    let _id = req.header('_id');

    User.findByIdAndToken(_id,refreshToken)
        .then(user=>{
            // User is found
            // Refresh token exists in the database - but we have to check if it has expired or not
            if(!user){
                return res.status(401).send('User with given credentials doesnt exists');
            }
            _id = user._id;
            refreshToken = refreshToken;
            req.userObject = user;

            let isSessionValid = false;
            
            user.sessions.forEach((session)=>{
                // check if the session has expired
                if(session.token === refreshToken){
                    if(User.hasRefreshTokenExpired(session.expiresAt) === false){
                        // refresh token no expired
                        isSessionValid = true;
                    }
                }
            })

            if(isSessionValid){
                // session is valid - call next to contrinure with processiong 
                next()
            }
            else{
                return Promise.reject({
                    "error":"Refresh token has expired or the session is invalid"
                });
            }
        })
        .catch(err=>{
            console.log(err);
            return res.status(401).send('Unautorized')
        })

        

}

const authentication = (req,res,next)=>{
    const authToken = req.header('x-access-token');
    console.log(authToken);
    if(!authToken){
        return res.status(401).send('Bad authentication. access token is not provided')
    }
    jwt.verify(authToken,User.getJWTSecret(),(err,user)=>{
        if(err){
            return res.status(401).send(err);
        }
        console.log(user);
        // jwt is valid
        req.userId = user._id;
        next();
    })
    
}   


module.exports = {verifySession,authentication}