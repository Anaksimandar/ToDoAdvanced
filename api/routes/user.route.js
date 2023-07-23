const express = require('express');
const userRouter = express.Router();
const {verifySession} = require('../controlers/user.auth.controler');
const {User} = require('../models/user.model')



// GET /users/me/access-token
// Purpose: generate and returns an access token

userRouter.get('/me/access-token',verifySession,async (req,res)=>{
    
    const user = req.userObject;
    // we know that user is authenticated and we have the user_id and object available
    console.log(req.userObject);
    try{
        const newAccessToken = await user.generateAccessToken();
        const newRefreshToken = await user.generateRefreshToken();

        return res
                
                .header("x-refresh-token",newRefreshToken)
                .send({accessToken:newAccessToken,refreshToken:newRefreshToken})
    }
    catch(err){
        return res.send('Error with generating tokens' + err);
    }
   
})

// POST /users/sign-up
// Purpose: User sign up 
userRouter.post('/sign-up',async (req,res)=>{
    const user = req.body;
    const userModel = new User(user);
    try{
        const newUser = await userModel.save();
        // const tokens = await newUser.createSession();
        
        return res.send(newUser);
    }
    catch(err){
        res.status(500).send(err);
    }

})


// POST /users/login
// Purpose: Login in 

userRouter.post('/login', async (req,res)=>{
    const email = req.body.email;
    const password = req.body.password;
    
    try{
        const foundUser = await User.findByCredentials(email,password);
        // podrazumeva se da korisnik postoji jer bi u suprotnom bila bacena greska (reject)
        const accessToken = await foundUser.generateAccessToken();
        const refreshToken = await foundUser.createSession();
        console.log(refreshToken);
        res
            .header("Access-Control-Expose-Headers","x-access-token, x-refresh-token")
            .header("x-access-token",accessToken)
            .header("x-refresh-token",refreshToken)
            .send(foundUser);

    }
    catch(err){
        res.send('Greska' + err);
    }
    

    // User.findByCredentials(email,password).then(user=>{
    //     console.log(user);
    //         return user.createSession().then(refreshToken=>{
    //                 // Seassion is created - refresh Token returned
    //                 // Now we need to generate access auth for user
    //                 return user.generateAccessAuthToken()
    //                     .then(accessToken=>{
    //                         return {accessToken, refreshToken}
    //                     })
    //             })
    //             .then(authToken=>{
    //                 res
    //                     .header('x-refresh-token', authToken.refreshToken)
    //                     .header('x-access-token', authToken.accessToken)
    //                     .send(user);
    //             })
    // }).catch(err=>{
    //     res.status(400).send(err);
    // })
        
})

// Testing routes

userRouter.get('/',async (req,res)=>{
    const users = await User.find();
    res.send(users);
})

userRouter.delete('/',async (req,res)=>{
    const deletedUsers = await User.deleteMany();
    res.send()
})

module.exports = {userRouter}