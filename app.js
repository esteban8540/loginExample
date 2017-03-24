var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//libreriass Passport

var passport = require("passport");
var localStrategy = require("passport-local").Strategy;
var session = require("express-session");
var bcrytp = require("bcrypt-nodejs");
var usuarioModel = require("../models/usuarios");

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

//configuracion passport
passport.use(new localStrategy(
  function(correo,clave,done){
    new usuarioModel.usuarios({correo:correo}).fetch().then(
      function(info){
        var usuarioInfo = info;
        if(usuarioInfo == null){
          return done(null,false,{mensaje:"Email no valido"});
        }else{
          usuarioInfo = usuarioInfo.toJson();
          if(!bcrytp.compareSync(clave, usuarioInfo.clave)){
            return done(null,false,{mensaje:"clave no valido"});
          }else{
            return done(null,usuarioInfo);
          }
        }
      }
    );
  }
));

passport.serializeUser(function(usuario,done){
  done(null,usuario.usuario);
});

passport.deserializeUser(function(usuario,done){
  new usuarioModel.usuarios({usuario:usuario}).fetch().then(
    function(usuario){
      done(null,usuario);
    }
  );
});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({secret: "Es una frase", cookie:{maxAge:60000},resave:true, saveUninitialized:true}));
app.use(passport.initialize());
app.use(passport.session());

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
