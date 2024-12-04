const jwt = require('jsonwebtoken');
const config = require('../config/config');
const logger = require('../config/logger');

exports.authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split('')[1];

    if(!token) {
        return res.status(401).json({ message: 'Authentication failed' });
    }

    try {
        const decoded = jwt.verify(token, config.jwt.secret);
        req.user = decoded;
        next();
        } catch (error) {
            logger.error('Authentication error', { error: error.message });
            return res.status(401).json({ message: 'Invalid token' });
        }
};
