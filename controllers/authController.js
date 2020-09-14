const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config({ path: '../config/config.env' });

const User = require('../models/User');

class AuthController {
    static async userSignup (req, res, next) {
        try {
            const user = req.body;

            const uniqueUser = await User.findOne({email: user.email});

            if(uniqueUser) {
                return res.status(400).json({
                    success: false,
                    message: 'User already exists'
                })
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(user.password, salt);
            user.password = hashedPassword;

            const savedUser = await User.create(user);
            
            return res.status(201).json({
                success: true,
                message: 'User registered successfully',
                data: savedUser
            });
        } catch (err) {
            if (err.name === 'ValidationError') {
                const messages = Object.values(err.errors).map(val => val.message);
    
                return res.status(400).json({
                    success: false,
                    message: messages
                })
            } else {
                return res.status(500).json({
                    success: false,
                    message: 'Server Error'
                })
            }
        }
    }

    static async userLogin (req, res, next) {
        try {
            const { email, password } = req.body;
            if(!email || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Incomplete details supplied'
                })
            };

            const userExists = await User.findOne({ email });
            if (!userExists) {
                return res.status(404).json({
                    success: false,
                    message: 'Email address not found'
                })
            };

            const validPassword = await bcrypt.compare(password, userExists.password);
            if(!validPassword) {
                return res.status(400).json({
                    success: false,
                    message: 'Incorrect password provided. Please try again'
                })
            };

            const accessToken = jwt.sign({email, userId: userExists._id}, process.env.TOKEN_KEY, {expiresIn: '24hr'});
            
            const updateToken = await User.findByIdAndUpdate(userExists._id, {token: accessToken});

            return res.status(200).json({
                success: true,
                message: 'User logged in successfully',
                data: {
                    user: userExists,
                    token: accessToken
                }
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: 'Server Error'
            })
        }
    }
};


module.exports = AuthController;
