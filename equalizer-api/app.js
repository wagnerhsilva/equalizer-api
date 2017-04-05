var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
// Configuring Passport
var passport = require('passport');
var expressSession = require('express-session');

var index = require('./routes/index')(passport);
var home = require('./routes/home');
var horaservidor = require('./routes/horaservidor');
var usuarios = require('./routes/usuarios');
var bacsstatus = require('./routes/bacsstatus');
var redeseguranca = require('./routes/redeseguranca');
var alarmlog = require('./routes/alarmlog');
var timeserver = require('./routes/timeserver');
var usuarioview = require('./routes/usuarioview');
var bacsstatusview = require('./routes/bacsstatusview');
var redesegurancaview = require('./routes/redesegurancaview');
var alarmlogview = require('./routes/alarmlogview');
var timeserverview = require('./routes/timeserverview');
var equalizerdb = require('./database/equalizerdb');
var usuario = require('./models/Usuario');


//init sqlite database
equalizerdb.init();

/*
var usuarioModel = new usuario.createUser('Rodrigo', 'Bueno', '19999999999', 'rsb.bueno@gmail.com', '123', 'usuario');
usuario.save(usuarioModel);
usuario.getAll(function (data) {
  //console.log(data);
});
console.log(usuario.getById(25, function (data) {
  console.log(data);
}));
*/
// load mongoose package
/*var mongoose = require('mongoose');
// Use native Node promises
mongoose.Promise = global.Promise;
// connect to MongoDB
mongoose.connect('mongodb://localhost/equalizer')
    .then(() => console.log('connection succesful'))
    .catch((err) => console.error(err));
*/
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressSession({ secret: 'minhaChaveSecreta' }));
// Configuring Passport
app.use(passport.initialize());
app.use(passport.session());

// Using the flash middleware provided by connect-flash to store messages in session
// and displaying in templates
var flash = require('connect-flash');
app.use(flash());

// Initialize Passport
var initPassport = require('./passport/init');
initPassport(passport);

app.use('/', index);
app.use('/home', home);
app.use('/horaservidor', horaservidor);
app.use('/usuarios', usuarios);
app.use('/bacsstatus', bacsstatus);
app.use('/redeseguranca', redeseguranca);
app.use('/alarmlog', alarmlog);
app.use('/timeserver', timeserver);
app.use('/usuarioview', usuarioview);
app.use('/bacsstatusview', bacsstatusview);
app.use('/redesegurancaview', redesegurancaview);
app.use('/alarmlogview', alarmlogview);
app.use('/timeserverview', timeserverview);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
