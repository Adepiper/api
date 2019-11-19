const bcrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const User = require('./user');

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    (email, password, done) => {
      // console.log(email);
      User.findOne({ email: email })
        .then(user => {
          // console.log(user);
          if (!user) {
            return done(null, false, {
              message: 'that email is not registered'
            });
          }
          bcrypt.compare(password, user.password, (err, isMatch) => {
            // console.log(err, isMatch);
            if (err) throw err;

            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false, { message: 'password incorrect' });
            }
          });
        })
        .catch(err => {
          console.log(err)
          return done(err)
        });
    }

  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});
