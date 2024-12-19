const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

const userModel = require('../models/userModel');
const bookModel = require('../models/bookModel');
const config = require('../config/config');
const logger = require('../config/logger');

// Registration logic
exports.register = async(req, res, next) => {
    const { username, email, password } = req.body;

    try{
        const existingUser = await userModel.findOne({ $or: [{ username }, { email }] });
        // Check if user already exists
        if(existingUser){
            return res.status(400).json({message: 'User already exists!', field: existingUser.username === username ? 'username' : 'email'});
        }
        //Hash password before saving
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);


        const newUser = new userModel({
            username,
            email,
            password: hashedPassword,
            isActive: true,
            registeredAt: Date.now()
        });

        await newUser.save();

        //Log registration
        logger.info(`New user registered`,
        {
            userId: newUser._id,
            username: newUser.username,
        });
        
        res.status(201).json({message: 'User created successfully!', userId: newUser._id, token: ''});
    }
    catch(err){
        logger.error('Registration error', {
            error: err.message,
            stack: err.stack
        });
        next(err);
    }
};

// Login Logic
exports.login = async(req, res, next) => {
    const { username, password } = req.body;

    try{
        const user = await userModel.findOne({username}).select('+password' + '+isActive');

        if(!user){
            logger.warn('Login attempt with invalid username', {username});
            return res.status(400).json({message: 'Invalid username or password'});
        }

        //Check if user is active
        if(!user.isActive){
            return res.status(400).json({message: 'User is not active'});
        }

        //Check if password is a valid one
        const isValidPassword = await bcrypt.compare(password, user.password);
        if(!isValidPassword){
            logger.warn('Login attempt with invalid password', {username, userId: user._id});
            return res.status(400).json({message: 'Invalid username or password'});
        }

        //Generate JWT Token
        const payload = {id: user._id};
        const token = jwt.sign(payload, config.jwt.secret, { expiresIn: config.jwt.expiresIn, algorithm: 'HS256' });
        const refreshToken = jwt.sign(payload, config.jwt.refreshSecret, { expiresIn: config.jwt.refreshExpiresIn});
        //Log successful login
        logger.info('User logged in', {
            userId: user._id,
            username: user.username
        });

        res.status(200).json({message: 'Login Successful!',
             token,
              refreshToken,
            user:{
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    }
    catch(err){
        logger.error('Login error', {
            error: err.message,
            stack: err.stack
        });
        next(err);
    }
};

//Forgot Password Logic
exports.forgetPassword = async(req, res, next) => {
    try{
        const {email} = req.body;

        //Find the user by email
        const user = await userModel.findOne({email});

        // If user is not found, send error message
        if(!user){
            return res.status(400).json({message: 'Email not found'});
        }
        
        //Generate a 6-digit numerical token
       const resetOTP = Math.floor(100000 + Math.random() * 900000).toString();
       const hashedOTP = crypto.createHash('sha256').update(resetOTP).digest('hex');
       
        //Save the token and expiry time in database
        user.resetPasswordToken = hashedOTP;
        user.resetPasswordExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
        await user.save();

        console.log('User after saving OTP:', user);

        //Send the token to user's email
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: config.email.user,
                pass: config.email.pass,
            },
        });
        //Email configuration
        const mailOptions = {
            from: config.email.user,
            to: user.email,
            subject: 'Password Reset Request',
            html: `
                <h1>Password Reset</h1>
                <p>Your One-Time Password (OTP) is: </p>
                <h2>${resetOTP}</h2>
                <p>This OTP will expire in 10 minutes.</p>
                <p>If you did not request a password reset, please ignore this email.</p>
            `
        };
        console.log('Generated OTP:', resetOTP);
        //Send the email
        transporter.sendMail(mailOptions);

                // Log password reset request
                logger.info('Password reset requested', { 
                    userId: user._id, 
                    email: user.email 
                });
        
                res.status(200).json({ 
                    message: 'Password reset link sent to email' 
                });
            } catch (err) {
                logger.error('Forgot password error', { 
                    error: err.message, 
                    stack: err.stack 
                });
                next(err);
            }
        };

//Reset Password Logic
exports.resetPassword = async (req, res, next) => {
    try {
        const { email, resetOTP, newPassword } = req.body;

        // Hash the incoming token for comparison
        const hashedOTP = crypto.createHash('sha256').update(resetOTP).digest('hex'); // Hashing received OTP


        // Find user with valid reset token
        const user = await userModel.findOne({
            email,
            resetPasswordToken: hashedOTP,
            resetPasswordExpiry: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ 
                message: 'Invalid or expired OTP' 
            });
        }

        // Validate new password
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            return res.status(400).json({ 
                message: 'New password does not meet complexity requirements' 
            });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update user password and clear reset token
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiry = undefined;
        await user.save();

        // Log password reset
        logger.info('Password reset successfully', { 
            userId: user._id 
        });

        res.status(200).json({ 
            message: 'Password reset successfully' 
        });
    } catch (err) {
        logger.error('Reset password error', { 
            error: err.message, 
            stack: err.stack 
        });
        next(err);
    }
};
// Get Profile Logic
exports.getProfile = async (req, res, next) => {
    try {
        // Get user ID from the JWT token
        const userId = req.user.id;

        // Find user by ID and exclude password field
        const user = await userModel.findById(userId).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Log profile retrieval
        logger.info('User profile retrieved', { userId: user._id });

        res.status(200).json({
            message: 'Profile retrieved successfully',
            user
        });
    } catch (err) {
        logger.error('Profile retrieval error', {
            error: err.message,
            stack: err.stack
        });
        next(err);
    }
};

module.exports = {
    register: exports.register,
    login: exports.login,
    forgetPassword: exports.forgetPassword,
    resetPassword: exports.resetPassword,
    getProfile: exports.getProfile
};