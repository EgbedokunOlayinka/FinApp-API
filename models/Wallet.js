const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = require('./User');
const Profile = require('./Profile');

const walletSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    balance: {
        type: Number,
        default: 0
    },
    currency: {
        type: String,
        default: 'Naira'
    },
    status: {
        type: String,
        default: 'active',
        enum: ['active', 'inactive'],
    },
    overdraft: {
        type: String,
        default: 'positive',
        enum: ['positive', 'negative']
    }
}, {timestamps: true});

module.exports = mongoose.model('Wallet', walletSchema);