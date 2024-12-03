const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const UserModel = require("../models/userModel");
const logger = require("./logger");
const config = require("../config/config"); // Ensure you import config correctly

// Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: config.google.clientID,
    clientSecret: config.google.clientSecret,
    callbackURL: config.google.callbackURL,
},
async (accessToken, refreshToken, profile, done) => {
    try {
        // Find or create user
        let user = await UserModel.findOne({ googleId: profile.id });
        if (!user) {
            user = await UserModel.create({
                username: profile.displayName,
                email: profile.emails[0].value,
                googleId: profile.id,
                profilePicture: profile.photos[0].value,
            });

            logger.info("New user created", { userId: user._id, username: user.username });
        } else {
            logger.info("User logged in", { userId: user._id, username: user.username });
        }

        return done(null, user);
    } catch (error) {
        logger.error("Google Sign-In error", { error: error.message });
        return done(error, false);
    }
}));

// Session handling
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await UserModel.findById(id); // Correct model reference
        done(null, user);
    } catch (err) {
        logger.error("Error deserializing user", { error: err.message });
        done(err, null);
    }
});
