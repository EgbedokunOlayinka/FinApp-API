const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config({ path: '../config/config.env' });

exports.verifyUser = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader) {
        return res.status(401).json({
            success: false,
            message: 'Please login to access this resource'
        })
    };

    const token = authHeader.split(' ')[1];

    const userIsVerified = jwt.verify(token, process.env.TOKEN_KEY);

    if(!userIsVerified) {
        return res.status(401).json({
            success: false,
            message: 'Please login to access this resource'
        })
    };

    req.user = userIsVerified;

    next();
}