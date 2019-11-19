const express = require('express');
const app = express();
const userRoutes = express.Router();
const bycrpt = require('bcryptjs');
const passport = require('passport');

let User = require('./user');
let Passport = require('./passport');

userRoutes.post('/signup', (req, res) => {
  console.log(req.body);
  // let user = new User(req.body);

  User.findOne({ email: req.body.email })
    .then(user => {
      if (user) {
        return res.status(400).send('email already registered');
      } else {
        const newUser = new User({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          password: req.body.password,
          phone: req.body.phone
        });
        // console.log(newUser);

        bycrpt.genSalt(10, (err, salt) => {
          bycrpt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;

            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                // console.log(user);
                return res.status(200).status('you can login');
              })
              .catch(err => console.log(err));
          });
        });
      }
    })
    .catch();
});

userRoutes.post('/login', (req, res, next) => {
  return passport.authenticate(
    'local',
    { session: false },
    (err, passportUser, info) => {
      if (err) {
        return next(err);
      }

      if (passportUser) {
        console.log(passportUser);
        const user = passportUser;

        return res.status(200).json(user);
      }

      return res.status(400).json(info);
    }
  )(req, res, next);

  // res.status(401).json({ message: 'email or password incorrect' });
});

userRoutes.get('/logout', async function (req, res) {
 await req.logout();
 res.status(200).json({message: "logged out successfully"})
})

module.exports = userRoutes;
