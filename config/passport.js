const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Loading User mod

const User = require('../models/User');

module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {

      // Match username
      
      User.findOne({ email: email })
      .then(user => {
        if (!user) {
          return done(null, false, { message: 'This email is not registered' });
        }

        // Match password

        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: 'Password incorrect' });

          }

        });
      
      });
    })


  );

  passport.serializeUser((user, done) => {
    done(null, user._id);

  });

  passport.deserializeUser((id, done) => {
    User.findById(id)
      .then(user => {
        done(null, user);
      })
      .catch(err => {
        done(err, null);

      });

  });


};
