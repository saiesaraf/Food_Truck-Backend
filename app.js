var createError = require('http-errors');
var express = require('express');
const bodyParser = require("body-parser");
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require("cors");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var menuRouter = require('./routes/menuRouter');
var app = express();
app.use(cors());
app.options('*', cors());
var originsWhitelist = [
  'http://localhost:4200'
  ];
  var corsOptions = {
  origin: function(origin, callback){
  var isWhitelisted = originsWhitelist.indexOf(origin) !== -1;
  callback(null, isWhitelisted);
  },
  credentials:true
  }
  app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded( {extended: false}));
//mongoose to use
const mongoose = require('mongoose');
const Menu = require('./models/menu');
//connecting to the database
/*mongoose.connect(
  "mongodb://localhost:27017/Taco_Loco",{ useNewUrlParser: true }
)
.then(() => {
  console.log("Connected to database!");
})
.catch((err) => {
  console.log(err);
});*/

//connecting to MongoAtlas DB
//mongodb+srv://saiesaraf:<password>@cluster0-5czsu.mongodb.net/<dbname>?retryWrites=true&w=majority
mongoose.connect('mongodb+srv://saieFood:Saie@June2020@cluster0-5czsu.mongodb.net/Taco_Loco?retryWrites=true&w=majority',{
    useNewUrlParser:true,
    useCreateIndex:true
});


//First endpoint- Take input from the user- menu name and quantity
//Search in DB that name of menu and retrieve it's cost




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/menuNew', menuRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
