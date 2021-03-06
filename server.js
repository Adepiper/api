const express = require('express'),
  path = require('path'),
  bodyParser = require('body-parser'),
  cors = require('cors'),
  mongoose = require('mongoose'),
  config = require('./db'),
  userRoutes = require('./user/user.route')
  routes = require('./index.route'),
  session = require('express-session')
 
mongoose.Promise = global.Promise;
const app = express();
let port = process.env.PORT || 3000;
app.use(bodyParser.json());
app.use(cors());

require('./user/passport');


app.set('view engine', 'ejs');
app.use('/public', express.static('public'))

/*app.use('/user', (req, res, next) => 
{
	res.setHeader('Content-Type', 'application/json');
	res.setHeader('Access-Control-Allow-Origin', req.header('Origin') || '*');
	res.setHeader('Access-Control-Allow-Headers', '*');
	res.setHeader("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS,PATCH");
	res.setHeader('Access-Control-Allow-Credentials', true);
	res.status(200);
	next();
})*/

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

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


app.use('/', routes);
app.use('/user', userRoutes);

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
