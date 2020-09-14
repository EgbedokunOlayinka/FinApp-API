const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = require('./User');

const profileSchema = new Schema({
    firstName: {
        type: String,
        trim: true,
        required: [true, 'Please supply an email address']
    },
    lastName: {
        type: String,
        trim: true,
        required: [true, 'Please supply a phone number'],
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {timestamps: true});

module.exports = mongoose.model('Profile', profileSchema);