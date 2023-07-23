const mongoose = require('mongoose');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();


const UserSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        minlenght: 2,
        trim: true,
        unique: true
    },
    password:{
        type:String,
        required:true,
        minlenght:4
    },
    sessions:[new mongoose.Schema({
        refreshToken:{
            type:String,
            required:true
        }
    },{_id:false})]
});

// instace methods

UserSchema.methods.toJson =  function(){
    const user = this;
    const userObject = user.toObject();

    // return the document except the password and session (these shouldnt be made available)
    _.omit(userObject,['password','session']);

}

UserSchema.methods.generateAccessToken =  function(){
    const user = this;
    return new Promise((resolve,reject)=>{
        jwt.sign({_id:user._id.toHexString()},process.env.ACCESS_TOKEN_SECRET,{expiresIn:"1000s"},(err,token)=>{
            if(!err){
                resolve(token);
            }
            else{
                reject();
            }
        })
    })
    
}

UserSchema.methods.generateRefreshToken = function(){
    const user = this;

    return new Promise((resolve,reject)=>{
        jwt.sign({_id:user._id.toHexString()},process.env.REFRESH_TOKEN_SECRET,(err,token)=>{
            if(!err){
                resolve(token)
            }
            else{
                reject();
            }
        })
    })
    
    
        
    
}

// Model methods (static method)
UserSchema.statics.findByIdAndToken = async function(_id, token){
    const user = this;
    
    try{
        const foundedUser = await user.findById({_id:_id,'sessions.refreshToken':token});
        
        return foundedUser;
    }
    catch(err){
        return 'User couldnt be find' + err;
    }
}


// get access token secret

UserSchema.statics.getAccessTokenSecret = ()=>{
    return process.env.ACCESS_TOKEN_SECRET;
}


// get refresh token secret

UserSchema.statics.getRefreshTokenSecret = ()=>{
    return process.env.REFRESH_TOKEN_SECRET;
}




UserSchema.statics.findByCredentials = async function(email, password){
    const user = this;
    
    return new Promise((resolve,reject)=>{
        user.findOne({email})
            .then(user=>{
                console.log(user);
                if(!user) {
                    return reject('User doesnt exists');
                }
                // user exists
                // check the passwords match
                bcrypt.compare(password,user.password,(err,same)=>{
                    if (!same || err ){
                        return reject('Passwords not same');
                    }
                    return resolve(user);
                })
                

            })
            .catch(err=>{
                return reject('Error with finding user' + err);
            })
    })


    // return user.findOne({email})
    //     .then((user)=>{
    //         if(!user){
    //             return Promise.reject('User doesnt exists');
    //         }

    //         return new Promise((resolve, reject)=>{
    //             console.log('User:' + user);
    //             bcrypt.compare(password,user.password,(err,res)=>{
    //                 console.log(res);
                    
    //                 if(res) resolve(user);
    //                 else{
    //                     reject('Passwords are not same');
    //                 }
    //             })
    //         })
    //     })

}
UserSchema.statics.test = ()=>{
    return 'radi';
}


// Middleware
UserSchema.pre('save',async function(next){
    const costFactor = 10;
    let user = this;
    if(user.isModified('password')){
        // if password has been edited
        try{
            const salt = await bcrypt.genSalt(costFactor)
            const hashedPassword = await bcrypt.hash(user.password,salt);  
        
            user.password = hashedPassword;
            next();
        }
        catch(err){
            next(err);
        }
        
    }
    else{
        next();
    }
})

UserSchema.methods.createSession =  async function(){
    console.log('createSesion');
    let user = this;

    try{
        const refreshToken = await user.generateRefreshToken();
        await saveSessionToDataBase(user,refreshToken);
        return refreshToken;
    }
    catch(err){
        return 'Error with generating tokens: ' + err;
    }

    
}

let saveSessionToDataBase =  async function(user,refreshToken){
    console.log('saveSessionToDataBase');
    // save session to database
    // let expiresAt = generateAccessTokenExpiryDate(100);
    if(user.sessions.length === 0){
        user.sessions.push({'refreshToken':refreshToken});
    }

    return new Promise((resolve,reject)=>{
        user.save()
            .then(user=>{
                console.log(user);
                resolve(user);
            })
            .catch(err=>{
                reject(err);
            })
    })
}

// Is refresh token expired
UserSchema.statics.hasRefreshTokenExpired = (expiresAt)=>{ // number of minutes
    let secondesSinceEpoch = Math.round(Date.now() / 1000); // since 1970.
    console.log(secondesSinceEpoch);
    console.log(expiresAt); 
    if(expiresAt > secondesSinceEpoch){
        return false;
    }
    return true;
}

let generateAccessTokenExpiryDate = (minutesUntilExpire)=>{
    let secondsUntilExpires = minutesUntilExpire * 60;
    let secondesSinceEpoch = Math.round(Date.now() / 1000);
    console.log(secondsUntilExpires);
    return (secondesSinceEpoch+secondsUntilExpires); 
}

const User = mongoose.model('User', UserSchema);

module.exports = {User};