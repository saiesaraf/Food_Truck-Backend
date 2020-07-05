var express = require("express");
var router = express.Router();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");
const passport = require("passport");
const User = require("../models/userData");
const Order = require("../models/order");

/*Order Details- Post order*/
router.post("/order",async function(req,res,next)
{
 var userEmail = req.body.email;
 
 const placedOrder = new Order({
    email: userEmail,
    items: req.body.items,
    total: req.body.total,
    placedOrderDate: req.body.date
});
placedOrder
    .save()
    .then(savedMenu => {
      console.log(savedMenu);
      res.json({success:true})
    })
    .catch(err => {
      console.log(err);
      res.json({success:false,msg:err});
    });
});

router.get("/getOrder/:id",async function(req,res,next)
{
    var prev_orders = [];
    console.log(req.params.id);
    Order.find({ email: req.params.id})
    .then(foundUser => {
        if(foundUser){
            prev_orders = foundUser
        }
        res.send(prev_orders);
    })
    .catch(err => {
      console.log(err);
      res.send(err);
    })
});


module.exports = router;

