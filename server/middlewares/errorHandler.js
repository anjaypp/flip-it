const logger = require('../config/logger');
const config = require('../config/config');
 const errorHandler = (err, req, res, next) => {
    // Log the full error
    logger.error('Unhandled error', {
        error: err.message,
        stack: err.stack
    });

    // Send appropriate error response
    res.status(err.status || 500).json({
        message: err.message || 'An unexpected error occurred',
        ...(config.node_env === 'development' && { stack: err.stack })
    });
};

module.exports = errorHandler;