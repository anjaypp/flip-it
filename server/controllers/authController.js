const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');


const userModel = require('../models/userModel');
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
        
        res.status(201).json({message: 'User created successfully!', userId: newUser._id});
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
                email: user.email
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
       const resetToken = crypto.randomBytes(32).toString('hex');
       const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        //Save the token and expiry time in database
        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
        await user.save();

        // Create reset URL
        const resetURL = `${config.frontendUrl}/reset-password?token=${resetToken}`;

        //Send the token to user's email
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: config.email.user,
                pass: config.email.password,
            },
        });
        //Email configuration
        const mailOptions = {
            from: config.email.user,
            to: user.email,
            subject: 'Password Reset Request',
            html: `
                <h1>Password Reset</h1>
                <p>You requested a password reset. Click the link below to reset your password:</p>
                <a href="${resetURL}">Reset Password</a>
                <p>This link will expire in 10 minutes.</p>
                <p>If you did not request a password reset, please ignore this email.</p>
            `
        };
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
        const { email, token, newPassword } = req.body;

        // Hash the incoming token for comparison
        const hashedToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        // Find user with valid reset token
        const user = await userModel.findOne({
            email,
            resetPasswordToken: hashedToken,
            resetPasswordExpiry: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ 
                message: 'Invalid or expired reset token' 
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

module.exports = exports;