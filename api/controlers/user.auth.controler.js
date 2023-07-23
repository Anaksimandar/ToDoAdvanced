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
                console.log('korisnik ne postoji');
                return res.status(401).send('User with given credentials doesnt exists');
            }
            req.userObject = user;
            let isSessionValid = false;
            user.sessions.forEach((session)=>{
                // check if the session has expired
                if(session.refreshToken === refreshToken){
                    isSessionValid = true;
                    // potrebno je izbaciti upotrebljeni refresh token i generisati novi
                }
            })

            if(isSessionValid){
                // session is valid - call next to contrinure with processiong 
                next()
            }
            else{
                return res.status(401).send('Bad authorization');
            }
        })
        .catch(err=>{
            console.log(err);
            return res.status(401).send('Unautorized'+err)
        })

        

}

const authentication = (req,res,next)=>{
    const authToken = req.header('x-access-token');
    console.log(authToken);
    if(!authToken){
        return res.status(401).send('Bad authentication. Access token is not provided')
    }

    jwt.verify(authToken,User.getAccessTokenSecret(),(err,user)=>{
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