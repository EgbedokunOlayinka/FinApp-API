const User = require('../models/User');
const Wallet = require('../models/Wallet');

class WalletController {
    static async createWallet(req, res, next) {
        try {
            const userId = req.user.userId;
            const urlId = req.params.id;
      
            // check if current user id is the same as the id in the url
            if (userId !== urlId) {
              return res.status(403).json({
                success: false,
                message: "Cannot create wallet for another user",
              });
            }
      
            
            const newWallet = { userId }
      
            const createWallet = await Wallet.create(newWallet);
      
            return res.status(201).json({
              success: true,
              message: "Wallet created successfully",
              data: createWallet
            });
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

module.exports = WalletController;