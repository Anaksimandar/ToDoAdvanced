const express = require('express');
const app = express();
const getConnection = require('./mongoDb');
const bodyParser = require('body-parser');
const cors = require('cors');
const {userRouter} = require('./routes/user.route')
const {listRouter} = require('./routes/list.route');
const bcrypt = require('bcrypt');

require('dotenv').config();

getConnection()
    .then((message)=>{
        // successfull connection
        console.log(message);

        app.use(bodyParser.json())
        app.use(cors());
        app.use('/users',userRouter);
        app.use('/lists',listRouter);
    
    app.use((req,res,next)=>{
        res.header("Access-Control-Allow-Origin","*")
        res.header("Access-Control-Allow-Methods", "GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, _id, x-access-token, x-refresh-token");
        next();
    })
    
    app.listen(5000,()=>{
        console.log('Server je aktivan na portu 5000');
    })
})
// error with connectiong to db
.catch(err=>{
    console.log(err);
})

