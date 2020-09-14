const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: [true, 'Please supply an email address']
    },
    phoneNumber: {
        type: Number,
        required: [true, 'Please supply a phone number'],
    },
    password: {
        type: String,
        required: [true, 'Please supply a password'],
        minLength: 8
    },
    token: {
        type: String
    },
    isAdmin: {
        type: Boolean,
        default: false
    }

}, {timestamps: true});

module.exports = mongoose.model('User', userSchema);