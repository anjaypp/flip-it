const express = require('express');

const cors = require('cors');
const config = require('./config/config');
const connectDB = require('./config/db');

// Create Express app
const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

//Routes


// Start the server
const PORT = config.port;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
