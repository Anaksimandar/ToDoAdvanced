const express  = require('express');
const app = express();

const posts = [
    {
        username:'Aleksandar',
        content:'Post1'
    },
    {
        username:'Marko',
        content:'Post2'
    },
    {
        username:'Nikola',
        content:'Post3'
    }
];


app.get('/',(req,res)=>{
    res.send.json(posts);
})

app.post('/login',(req,res)=>{
    const username = req.body.username;
    const user = {name:username};
    
})



app.listen(3000,()=>{
    console.log('Server je aktivan na portu: 3000');
})