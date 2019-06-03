var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
//var mongoose = require('mongoose');

var signUpRouter = require('./routes/sign_up')
var indexRouter = require('./routes/index');
//var usersRouter = require('./routes/users');
var signUpCheckRouter = require('./routes/sign_up_check');

var loginCheckRouter = require('./routes/loginCheck');
var kcalUploadRouter = require('./routes/kcalUpload');
var kcalSuccessRouter = require('./routes/kcalSuccess');
var fitbitUploadRouter = require('./routes/fitbitUpload');
var fitbitSuccessRouter = require('./routes/fitbitSuccess');


var app = express();
var engine = require('ejs-locals');

var path = require ('path');
app.use(express.static(path.join(__dirname + '.../public')));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));




app.use('/', indexRouter);
//app.use('/users', usersRouter);
app.use('/sign_up' , signUpRouter);
app.use('/sign_up_check' , signUpCheckRouter);
app.use('/loginCheck', loginCheckRouter);
app.use('/kcalUpload', kcalUploadRouter);
app.use('/kcalSuccess', kcalSuccessRouter);
app.use('/fitbitUpload', fitbitUploadRouter);
app.use('/fitbitSuccess', fitbitSuccessRouter);


app.engine('ejs', engine);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
