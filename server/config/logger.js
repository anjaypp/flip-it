const winston = require('winston');
const path = require('path');
const config = require('./config');


// Ensure logs directory exists
const logDirectory = path.join(__dirname, '../logs');
require('fs').mkdirSync(logDirectory, { recursive: true });

// Logger Configuration
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    // Error log
    new winston.transports.File({ 
      filename: path.join(logDirectory, 'error.log'), 
      level: 'error' 
    }),
    
    // Combined log
    new winston.transports.File({ 
      filename: path.join(logDirectory, 'combined.log') 
    }),

    // Console transport for development
    new winston.transports.Console({
      format: winston.format.simple(),
      silent: config.node_env
    })
  ]
});

module.exports = logger;