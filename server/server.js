var express = require('express');
var path = require('path');
var http = require('http');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compress = require('compression');

var routes = require('./app/routes/index');

var app = express();
app.use(compress()); 

var server = http.createServer(app);
var socket = require('socket.io');

GLOBAL.io = socket.listen(server);
var ns = io.of('/ns');

var port = 3000;
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'app/public')));

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

server.on('error', function(error) {
	logs.errorLog(error);
});

ns.on('connection', function (socket) {
    console.log('connected');
	socket.on('call', function (p1, fn) {
    console.log('client sent '+p1);
        // do something useful
        fn(0, 'some data'); // success
    });
});

server.listen(port, function(exception) {
	console.log('Server Started:'+ port);
})

module.exports = app;
