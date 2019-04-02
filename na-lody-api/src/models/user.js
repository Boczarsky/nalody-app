const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: String,
    password: String,
    icecreamShops: Array
})

module.exports = new mongoose.model('User', UserSchema, 'users');