const express = require('express');
const userRouter = express.Router();
const {verifySession,authentication} = require('../controlers/user.auth.controler');




// GET /users/me/access-token
// Purpose: generate and returns an access token

userRouter.get('/me/access-token',verifySession,(req,res)=>{
    // we know that user is authenticated and we have the user_id and object available
    console.log(req.userObject);
    req.userObject.generateAccessAuthToken()
        .then(accessToken=>{
            res.header('x-access-token',accessToken)
            .send(accessToken);
        })
        .catch(err=>{
            res.status(400).send(e);
        })
})

// POST /users/sign-up
// Purpose: User sign up 
userRouter.post('/sign-up',(req,res)=>{
    const user = req.body;
    const newUser = new User(user);

    newUser.save().then(()=>{
            console.log('user.save');
            return newUser.createSession();
        }).then(refreshToken=>{
            return newUser.generateRefreshAuthToken() // kreiranje authTokena
                .then(accessToken=>{
                    return {accessToken,refreshToken};
                })
        }).then(authToken=>{
            res
                .header("Access-Control-Expose-Headers","x-access-token, x-refresh-token")
                .header('x-refresh-token',authToken.refreshToken)
                .header('x-access-token',authToken.accessToken)
                .send(newUser);
                
        })
        .catch(err=>{
            res.status(404).send('Error with adding user' + err);
        })

})


// POST /users/login
// Purpose: Login in 

userRouter.post('/login',(req,res)=>{
    const email = req.body.email;
    const password = req.body.password;
    User.findByCredentials(email,password).then(user=>{
        console.log(user);
            return user.createSession().then(refreshToken=>{
                    // Seassion is created - refresh Token returned
                    // Now we need to generate access auth for user
                    return user.generateAccessAuthToken()
                        .then(accessToken=>{
                            return {accessToken, refreshToken}
                        })
                })
                .then(authToken=>{
                    res
                        .header('x-refresh-token', authToken.refreshToken)
                        .header('x-access-token', authToken.accessToken)
                        .send(user);
                })
    }).catch(err=>{
        res.status(400).send(err);
    })
        
})


module.exports = {userRouter}