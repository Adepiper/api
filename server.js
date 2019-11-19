const express = require('express'),
  path = require('path'),
  bodyParser = require('body-parser'),
  cors = require('cors'),
  mongoose = require('mongoose'),
  config = require('./db'),
  userRoutes = require('./user/user.route')
 

mongoose.Promise = global.Promise;

const app = express();
let port = process.env.port || 3000;
app.use(bodyParser.json());
app.use(cors());

app.use('/', require('./index.route'));
app.use('/user', userRoutes);
require('./user/passport');



app.set('view engine', 'ejs');
app.use('/public', express.static('public'))


app.use((err, req, res, next) => {
  console.log(err, res)
  res.status(err.status || 500)

  res.json({
    errors: {
      message: err.message,
      error: {}
    }
  })
})

mongoose.connect(config.DB, { useNewUrlParser: true }).then(
  () => {
    console.log('Database is connected');
    const server = app.listen(port, () => {
      console.log(`listening on port ${port}`);
    });
  },
  err => {
    console.log('Can not connect to database' + err);
  }
);
