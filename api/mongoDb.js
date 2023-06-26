const mongoose = require('mongoose');
const uri = "mongodb+srv://aco:root@cluster0.pvnoa.mongodb.net/ToDo?retryWrites=true&w=majority";

mongoose.connect(uri)
    .then(res=>{
        console.log('Uspesno povezivanje sa bazom');
    })
    .catch(err=>{
        console.log('Doslo je do greske ' , err);
    })

module.exports = mongoose;