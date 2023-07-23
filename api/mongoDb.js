const mongoose = require('mongoose');
const uri = "mongodb+srv://aco:root@cluster0.pvnoa.mongodb.net/ToDo?retryWrites=true&w=majority";


const getConnection = async ()=>{
    try{
        await mongoose.connect(uri);
        return ('Uspesno povezivanje sa bazom');
    }
    catch(err){
        return ('Doslo je do greske ' , err);
    }
}

module.exports = getConnection;