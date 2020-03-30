//we import passport packages required for authentication
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
//
//We will need the models folder to check passport agains
//const UserModel = require('../models/User');
//const user_model = new UserModel();

//
// Telling passport we want to use a Local Strategy. In other words,
//we want login with a username/email and password



passport.use(new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback : true
     },
    async function(req,email, password, done) {
      console.log('*** in passport.use',email,password)
      let users = await global.knex('user').select().where({email:email,password:password})
      if(users && users.length > 0 ){
        return done(null, users[0]);     
      }
      return done(null, false, req.flash('loginMessage', 'User not found/ Invalid Credentials')); // req.flash is the way to set flashdata using connect-flash

    }
  ));

//
// In order to help keep authentication state across HTTP requests,
// Sequelize needs to serialize and deserialize the user
// Just consider this part boilerplate needed to make it all work
passport.serializeUser(function(user, cb) {
  cb(null, user);
});
//
passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});
//
// Exporting our configured passport
module.exports = passport;