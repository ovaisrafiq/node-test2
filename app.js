'use strict';
require('dotenv').config();
const fs = require('fs');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const debug = require('./helpers/debug')('app');
const bodyParser = require('body-parser');
const session = require('express-session');
const app = express();
global.knex = require('./config/db/knex');
const passport = require('./config/passport');
const expressValidator = require('express-validator');
//const UserModel = require('./models/User');
//const user_model = new UserModel();
app.use(expressValidator())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({limit:'50mb', extended: true}));


app.use(express.static(path.join(__dirname, 'assests')));
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.use(logger('dev'));


/**LOGIN */
var flash    = require('connect-flash');
var crypto   = require('crypto');
/* Login script */

var sess  = require('express-session');
var Store = require('express-session').Store
var BetterMemoryStore = require(__dirname + '/memory')
var store = new BetterMemoryStore({ expires: 60 * 60 * 1000, debug: true })
app.use(sess({
   name: 'JSESSION',
   secret: 'MYSECRETISVERYSECRET',
   store:  store,
   resave: true,
   saveUninitialized: true
}));

app.use(function(req, res, next) {
  res.locals.user = req.session.user;
  next();
});



app.use(flash());
app.use(passport.initialize());
app.use(passport.session());




//loding routes
fs.readdirSync('./routes').forEach((file) => {
  if (file.split('.').pop() === 'js') {
      //console.log('adding route file: %s', file);
      app.use( require('./routes/' + file));
  }
});


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
    res.send( err.message);
  });
console.log("Server running")
module.exports = app;