/* eslint-disable consistent-return */
const passport = require('passport');
const passportJWT = require('passport-jwt');
const FacebookTokenStrategy = require('passport-facebook-token');
const User = require('./models/userModel');
require('dotenv').config();

const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

passport.use('facebookToken', new FacebookTokenStrategy({
  clientID: process.env.FB_CLIENT_ID,
  clientSecret: process.env.FB_CLIENT_SECRET,
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Check first for an existing user in the db
    const existingUser = await User.findOne({ 'facebook.id': profile.id });
    if (existingUser) {
      return done(null, existingUser);
    }

    // No existing user found, construct new user obj to add to DB
    const newUser = new User({
      method: 'facebook',
      facebook: {
        id: profile.id,
        email: profile.emails[0].value,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
      },
      profilePicture: './images/pp.png',
      created: new Date(),
      active: true,
      relationshipStatus: 'single',
    });

    // Save new user to DB and pass through User info
    await newUser.save();
    done(null, newUser);

    // Catch errors
  } catch (error) {
    done(error, false, error.message);
  }
}));

passport.use(new JWTStrategy({
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
}, (jwtPayload, done) => done(null, jwtPayload)));
