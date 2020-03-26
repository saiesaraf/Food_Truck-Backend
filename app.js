var createError = require('http-errors');
var express = require('express');
const bodyParser = require("body-parser");
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require("cors");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
app.use(cors());
app.options('*', cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded( {extended: false}));
//mongoose to use
const mongoose = require('mongoose');
const Menu = require('./models/menu');



//connecting to the database
mongoose.connect(
  "mongodb://localhost:27017/Taco_Loco",{ useNewUrlParser: true }
)
.then(() => {
  console.log("Connected to database!");
  
//Creating the existing collections in database called Tabo_Loco
/*Menu.create(
  {
    name:"veggie taco",
    cost:2.30
  }
);

Menu.create(
  {
    name:"Beef Taco",
    cost:3.00
  }
);

Menu.create(
  {
    name:"Chorizo Taco",
    cost:3.50
  }
);*/
})
.catch((err) => {
  console.log(err);
});
//Post Endpoint- user can add different types of menues
app.post("/menu_name",(req,res,next)=>
{
  const menu = new Menu(
    {
      name:req.body.name,
      cost:req.body.cost,
    });
    menu.save().then(createdmenu =>
      {
        console.log(createdmenu);
          res.status(201).json ({
          message :"New menu is added successfully",
        })
        })
        .catch(err =>{
          console.log(err);
        })

    });

//First endpoint- Take input from the user- menu name and quantity
//Search in DB that name of menu and retrieve it's cost
app.post("/post_order", async (req,res,next) => 
{
  //console.log(req.body);
  var data = req.body;
  var len = data.length;

  var isError = false;
  var total=0;
  for(var i=0;i<data.length;i++) {
    var requested_name = data[i].name;
    var requested_quanity = data[i].quantity;
    await Menu.findOne({"name" : requested_name}).then(foundbody => 
      {
        if(foundbody){
          var cost = foundbody.cost; 
          total = total+ cost*requested_quanity;
         }
         else{
            res.status(400).json ({
              message :"Item " + requested_name + " Not found in menu",
            })
            isError  = true

         }
    })
    .catch(err =>
      {
          res.send(err);
      })
  }
  //for loop ends
  if(len >=4)
  {
    total = total - (total *20)/100;
  }

  if(isError == false) {
    res.send({"total" : total});
  }
});

//End point that displays the menu, item and price
app.get("/menu",(req,res,next) =>
{
  var total_menu =[];
  console.log('here');
  Menu.find().then(allmenu =>
    {
      allmenu.forEach(function(item)
      {
        const menu_obj =
        {
            name :item.name,
            cost:item.cost
        }
        total_menu.push(menu_obj);
      })
      res.send(total_menu);
    })
    .catch(err =>
      {
        console.log(err);
      })
})



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
