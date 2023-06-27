const express = require('express');
const app = express();
const mongoose = require('./mongoDb');
const {Task,List,User} = require('./models/index');
const bodyParser = require('body-parser');
const cors = require('cors');
const {userRouter} = require('./routes/user.route')
const {listRouter} = require('./routes/list.route');
const jwt = require('jsonwebtoken');

app.use(bodyParser.json())
app.use(cors());
app.use('/users',userRouter);
app.use('/lists',listRouter);


app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Origin","*")
    res.header("Access-Control-Allow-Methods", "GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, _id");
    next();
})

app.listen(5000,()=>{
    console.log('Server je aktivan na portu 5000');
})