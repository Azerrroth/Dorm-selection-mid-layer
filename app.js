var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var proxy = require('express-http-proxy');
const cors = require('cors');


var router = require('./routes/api')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

require('dotenv').config()
const urls = {
  userPath: process.env.USER_SERVICE_URL,
  dormPath: process.env.DORM_SERVICE_URL,
  orderPath: process.env.ORDER_SERVICE_URL,
  loginPath: process.env.LOGIN_SERVICE_URL,
  registerPath: process.env.REGISTER_SERVICE_URL,
  tokenPath: process.env.TOKEN_SERVICE_URL,
  testPath: process.env.TEST_SERVICE_URL,
}
if (process.env.NODE_ENV !== 'production') {
  console.log(urls)
}

app.use('/api/v1/user/*', proxy(urls.userPath, { proxyReqPathResolver: (req, res) => { return req.baseUrl } }))
app.use('/api/v1/dorm/*', proxy(urls.dormPath, { proxyReqPathResolver: (req, res) => { return req.baseUrl } }))
app.use('/api/v1/order/*', proxy(urls.orderPath, { proxyReqPathResolver: (req, res) => { return req.baseUrl } }))

app.use('/api/v1/login', proxy(urls.loginPath, { proxyReqPathResolver: (req, res) => { return req.baseUrl } }))
app.use('/api/v1/register', proxy(urls.registerPath, { proxyReqPathResolver: (req, res) => { return req.baseUrl } }))
app.use('/api/v1/token', proxy(urls.tokenPath, { proxyReqPathResolver: (req, res) => { return req.baseUrl } }))
app.use('/test', proxy(urls.testPath, { proxyReqPathResolver: (req, res) => { return req.baseUrl } }))



var history = require('connect-history-api-fallback');
app.use(express.static(path.join(__dirname, 'dist')));
app.use(history());
app.use(express.static(path.join(__dirname, 'dist')));

app.use('/api/*', router)


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
