var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var auth = require("./middlewares/auth");
var admin = require("./middlewares/admin");
var guest = require("./middlewares/guest");

var indexRouter = require('./routes/index');
var signupRouter = require('./routes/signup');
var authRouter = require('./routes/login');
var usersRouter = require('./routes/users');
var categoryRouter = require('./routes/category');
var questionRouter = require('./routes/QuestionRoutes');
var quizRouter = require('./routes/quiz');

// Import error handler middleware
const { errorHandler, notFoundHandler } = require('./middlewares/errorHandler');

var app = express();

require('dotenv').config();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 // 24 hours
  }
}));


app.use('/home', auth, indexRouter);
app.use('/signup', guest, signupRouter);
app.use('/auth', authRouter);


// Legacy admin routes (keeping for backward compatibility)
app.use('/admin/users', admin, usersRouter);
app.use('/admin/categories', admin, categoryRouter);
app.use('/admin/questions',admin, questionRouter);

app.use('/quiz', auth, quizRouter);

// catch 404 and forward to error handler
app.use(notFoundHandler);

// error handler - MUST be last
app.use(errorHandler);

module.exports = app;