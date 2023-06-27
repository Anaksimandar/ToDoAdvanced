const mongoose = require('mongoose');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const jwtSecret = "123223212323hsda321";
const crypto = require('crypto');
const bcrypt = require('bcrypt');

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
    sessions:[
        {
            accesstoken:{
                type:String,
                required:true
            },
            expiresAt:{
                type:Number,
                required:true
            }
        }
    ]
});

// instace methods

UserSchema.methods.toJson =  function(){
    const user = this;
    const userObject = user.toObject();

    // return the document except the password and session (these shouldnt be made available)
    _.omit(userObject,['password','session']);

}

UserSchema.methods.generateAccessAuthToken =  function(){
    const user = this;
    return new Promise((resolve,reject)=>{
        // Create JSON Web Token
        jwt.sign({_id:user._id.toHexString()},jwtSecret,{expiresIn:"1000s"},(err,token)=>{
            if(!err){
                console.log(token);
                resolve(token);
            }
            else{
                reject();
            }
        })
    })
}

UserSchema.methods.generateRefreshAuthToken = function(){
    return new Promise((resolve, reject)=>{
        crypto.randomBytes(64,(err,buf)=>{
            if(!err){
                // no err
                let token = buf.toString('hex');

                return resolve(token);
            }
            else{
                return reject();
            }
        })
    })
}

// Model methods (static method)
UserSchema.statics.findByIdAndToken = function(_id, token){
    
    const User = this;
    
    return User.findOne({
        _id,
        'sessions.accesstoken':token
    })
    .then(user=>{
        
        if(user === undefined) return Promise.reject('User doesnt exist');
        console.log(user);
        return user;
    })
    .catch(err=>{
        return Promise.reject('Error' + err);
    })
}


// get JWT secret

UserSchema.statics.getJWTSecret = ()=>{
    return jwtSecret;
}




UserSchema.statics.findByCredentials = function(email, password){
    const User = this;
    return User.findOne({email})
        .then((user)=>{
            if(!user){
                return Promise.reject('User doesnt exists');
            }

            return new Promise((resolve, reject)=>{
                console.log('User:' + user);
                bcrypt.compare(password,user.password,(err,res)=>{
                    console.log(res);
                    
                    if(res) resolve(user);
                    else{
                        reject('Passwords are not same');
                    }
                })
            })
        })

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

UserSchema.methods.createSession =  function(){
    console.log('createSesion');
    let user = this;
    return user.generateAccessAuthToken() // u ovom slucaju momak je odlucio da kreira refresh token pa zatim access token
            .then(accessToken=>{
                return saveSessionToDataBase(user,accessToken)
                    .then(accessToken=>{
                        return accessToken;
                    })
                    .catch(err=>{
                        return Promise.reject(err);
                    })
            })
}

let saveSessionToDataBase =  function(user,accessToken){
    console.log('saveSessionToDataBase');
    // save session to database
    return new Promise((resolve,reject)=>{
        let expiresAt = generateRefreshTokenExpiryTime(100);
        user.sessions.push({'accesstoken':accessToken,expiresAt:expiresAt})

        user.save()
            .then(()=>{
                // saved session successfully
                return resolve(accessToken);
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

let generateRefreshTokenExpiryTime = (minutesUntilExpire)=>{
    let secondsUntilExpires = minutesUntilExpire * 60;
    let secondesSinceEpoch = Math.round(Date.now() / 1000);
    console.log(secondsUntilExpires);
    return (secondesSinceEpoch+secondsUntilExpires); 
}

const User = mongoose.model('User', UserSchema);

module.exports = {User};