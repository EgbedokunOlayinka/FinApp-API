const express = require('express');
const router = express.Router();

const { verifyUser } = require('../middleware/middleware');

const AuthController = require('../controllers/authController');
const ProfileController = require('../controllers/profileController');
const WalletController = require('../controllers/walletcontroller');
const TransactionController = require('../controllers/transactionController');

// auth routes
router.post('/signup', AuthController.userSignup);  // sign up a user
router.post('/login', AuthController.userLogin);    // sign in a user

// profile routes
router.post('/user/:id/profile', verifyUser, ProfileController.setDetails);     // set user profile
router.put('/user/:id/profile', verifyUser, ProfileController.updateProfile);   //  update user profile

// wallet routes
router.post('/user/:id/wallet', verifyUser, WalletController.createWallet);   // create a wallet

// transaction routes
router.post('/wallet/:id/transaction', verifyUser, TransactionController.doTransaction);  // carry out transaction

module.exports = router;
