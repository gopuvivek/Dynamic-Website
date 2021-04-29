const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const autoSchema = new Schema({
    brand:{
        type: String,
        required: true
    },
    model:{
        type: String,
        required: true,
    },
    quantity:{
        type: Number,
        required: true
    },
    price:{
        type: Number,
        required: true
    }
},{ timestamps :true });

const CarStock = mongoose.model('dasauto',autoSchema); // dasautos will be the collection name
module.exports = CarStock;