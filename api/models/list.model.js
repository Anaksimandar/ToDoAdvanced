const mongoose = require('mongoose');

const ListSchema = mongoose.Schema({
    title:{
        type:String,
        required:true,
        minlenght:1,
        trim:true
    },
    _userId:{
        type:mongoose.Types.ObjectId,
        required:true,
    }
});

const List = mongoose.model('List',ListSchema);

module.exports = {List};