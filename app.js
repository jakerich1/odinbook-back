/* eslint-disable no-console */
// Package imports
require('./passport');
require('dotenv').config();
const path = require('path');
const cors = require('cors');
const logger = require('morgan');
const helmet = require('helmet');
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const compression = require('compression');
const cookieParser = require('cookie-parser');

// Database config
const mongoDb = process.env.MONGO_ADDRESS;
mongoose.connect(mongoDb, { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongo connection error'));

// Import routes
const indexRouter = require('./routes/index');
const auth = require('./routes/auth');
const user = require('./routes/user');
const post = require('./routes/post');
const comment = require('./routes/comment');
const errorRoute = require('./routes/error');
const s3 = require('./routes/s3');

// Express app initialization
const app = express();

// Init middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(compression());
app.use(helmet());

// Configure CORS
const corsOptions = {
  origin: ['https://jakerich1.github.io/odinbook'],
  optionsSuccessStatus: 200, // For legacy browser support
};

app.use(cors(corsOptions));

// Define routes
app.use('/un', indexRouter); // Unprotected routes
// Login via jwt auth + sign up route
app.use('/auth', auth);
// Protected user routes via jwt authentication
app.use('/user', passport.authenticate('jwt', { session: false }), user);
// Protected post routes via jwt authentication
app.use('/post', passport.authenticate('jwt', { session: false }), post);
// Protected comment routes via jwt authentication
app.use('/comment', passport.authenticate('jwt', { session: false }), comment);
// Error handling
app.use('/error', passport.authenticate('jwt', { session: false }), errorRoute);
// Image / multimedia handling
app.use('/s3', passport.authenticate('jwt', { session: false }), s3);

app.use((req, res) => {
  res.status(404).send('route not found');
});

module.exports = app;
