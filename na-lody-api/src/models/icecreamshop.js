const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const IcecreamShopSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    owner: String,
    name: String,
    description: String,
    imageUrl: String,
    address: {
        city: String,
        street: String,
        latitude: Number,
        longitude: Number
    },
    flavours: Array
})

module.exports = new mongoose.model('IcecreamShop', IcecreamShopSchema, 'icecreamshops');