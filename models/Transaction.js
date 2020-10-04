const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = require('./User');
const Wallet = require('./Wallet');

const transactionSchema = new Schema({
    description: {
        type: String,
        required: true
    },
    walletId: {
        type: Schema.Types.ObjectId,
        ref: 'Wallet',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    crWallet: {
        type: String
    },
    type: {
        type: String,
        enum: ['topup', 'payment'],
        required: true
    }
}, {timestamps: true});

module.exports = mongoose.model('Transaction', transactionSchema);