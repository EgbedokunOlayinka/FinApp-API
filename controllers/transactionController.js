const Wallet = require("../models/Wallet");
const User = require("../models/User");
const Transaction = require("../models/Transaction");

class TransactionController {
  static async doTransaction(req, res, next) {
    try {
      const walletId = req.params.id;
      const { amount: strAmount, description, crWallet } = req.body;
      const amount = +(strAmount);

      // check if current user id is the same as the user id in the wallet
      const currentUserId = req.user.userId;
      const walletDetails = await Wallet.findOne({ _id: walletId });
      const { userId, balance: strBalance, currency, status, overdraft } = walletDetails;
      const balance = +(strBalance);

      if (userId != currentUserId) {
        return res.status(403).json({
          success: false,
          message: "Cannot carry out transaction on another user's wallet",
        });
      }

      // check if transaction is a topup or payment to another wallet
      if (crWallet) {
        const type = "payment";

        // check if recipient wallet exists
        const findRecipient = await Wallet.findOne({ _id: crWallet });

        if(!findRecipient) {
            return res.status(404).json({
                success: false,
                message: 'Recipient wallet not found'
            })
        }

        const {
          userId: crUserId,
          balance: crStrUserBalance,
          currency: crCurrency,
          status: crStatus,
          overdraft: crOverdraft,
        } = findRecipient;

        const crUserBalance = +(crStrUserBalance);

        // check if user's balance is more than or equal to the amount to be paid
        if (balance < amount) {
          return res.status(400).json({
            success: false,
            message: "Insufficient funds",
          });
        }

        // debit user wallet
        const newBalance = balance - amount;
        const debitUser = await Wallet.findOneAndUpdate(
          {
            _id: walletId,
          },
          {
            userId,
            currency,
            status,
            overdraft,
            balance: newBalance,
          },
          {
            new: true,
            runValidators: true,
          }
        );

        // credit recipient wallet
        const crNewBalance = crUserBalance + amount;

        const creditRecipient = await Wallet.findOneAndUpdate(
          {
            _id: crWallet
          },
          {
            userId: crUserId,
            currency: crCurrency,
            status: crStatus,
            overdraft: crOverdraft,
            balance: crNewBalance
          },
          {
            new: true,
            runValidators: true,
          }
        );

        // create new transaction
        const newTransaction = { amount, description, walletId, type, crWallet };
        const createTransaction = await Transaction.create(newTransaction);
        
        return res.status(201).json({
          success: true,
          message: "Payment transaction successful",
        });

      } else {
        const type = "topup";
        const newBalance = balance + amount;

        // credit user wallet
        const creditUser = await Wallet.findOneAndUpdate(
          { _id: walletId },
          {
            userId,
            currency,
            status,
            overdraft,
            balance: newBalance,
          }
        );

        // create new transaction
        const newTransaction = { amount, description, walletId, type };

        const createTransaction = await Transaction.create(newTransaction);

        return res.status(201).json({
          success: true,
          message: "Topup transaction successful",
        });
      }
    } catch (err) {
        if (err.name === "ValidationError") {
            const messages = Object.values(err.errors).map((val) => val.message);
    
            return res.status(400).json({
              success: false,
              message: messages,
            });
          } else {
            return res.status(500).json({
              success: false,
              message: "Server Error",
            });
        }
    }
  }
};

module.exports = TransactionController;
