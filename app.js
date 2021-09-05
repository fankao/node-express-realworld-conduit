const http = require('http'),
  path = require('path'),
  methods = require('methods'),
  express = require('express'),
  bodyParser = require('body-parser'),
  session = require('express-session'),
  cors = require('cors'),
  passport = require('passport'),
  globalErrorHandler = require('./routes/errorHandler'),
  morgan = require('morgan'),
  logger = require('./utils/logger');

const isProduction = process.env.NODE_ENV === 'prod' ? true : false

// Create global app object
const app = express();

app.use(cors());

// Normal express config defaults
// Development logging

const morganFormat = process.env.NODE_ENV !== "production" ? "dev" : "combined";
app.use(
  morgan(morganFormat, {
    skip: function(req, res) {
      return res.statusCode < 400;
    },
    stream: process.stderr
  })
);

app.use(
  morgan(morganFormat, {
    skip: function(req, res) {
      return res.statusCode >= 400;
    },
    stream: process.stdout
  })
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(require('method-override')());
app.use(express.static(__dirname + '/public'));

app.use(session({ secret: 'conduit', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false }));

const AppError = require('./utils/appError');
require('./models/User');
require('./models/Article');
require('./models/Comment');
require('./config/passport');
app.use(require('./routes'));
/// error handlers
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
app.use(globalErrorHandler);

module.exports = app;
