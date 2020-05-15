var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const mongoose = require('mongoose');

// Declaration of all endpoint routes
var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
var virusesRouter = require('./routes/api/viruses');
var dataRouter = require('./routes/datapop');

// const config = require('./config');

const db = 'mongodb://localhost:27017';

mongoose.connect(db+'/VirusDB', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, });

var app = express();

const cors = require('cors');

const corsConfig = {
  origin: true,
  credentials: true,
};

// handle cross-domain requests
// OPTIONS is the http request type that denotes a cross-domain request
app.use(cors(corsConfig),(req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Cookie');
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH', 'OPTIONS');
  //console.log(`This is my modified headers ${JSON.stringify(res.getHeaders())}`);
  next();
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'jade');

app.use('/', indexRouter);
app.use('/data', dataRouter);
app.use('/api/viruses', virusesRouter);

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
