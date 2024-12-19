const express = require('express');
const session = require('express-session');
const passport = require('passport');
const morgan = require('morgan');
const cors = require('cors');
const config = require('./config/config');
require("./config/auth");
const connectDB = require('./config/db');

// Create Express app
const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

//Express Session Middleware
app.use(session({
    secret: config.google.sessionSecret,
    resave: false,
    saveUninitialized: false,
}));


// Initialize passport middleware
app.use(passport.initialize());
app.use(passport.session());


//Routes
const authRoutes = require('./routes/authRoutes');  
app.use('/api/auth', authRoutes);

const bookRoutes = require('./routes/bookRoutes');  
app.use('/api/book', bookRoutes);

const adminRoutes = require('./routes/adminRoutes');
app.use('/api/admin', adminRoutes);

const cartRoutes = require('./routes/cartRoutes');
app.use('/api/cart', cartRoutes);

const wishlistRoutes = require('./routes/wishlistRoutes');
app.use('/api/wishlist', wishlistRoutes);


// Start the server
const PORT = config.port;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
