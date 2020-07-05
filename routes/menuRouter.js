var express = require("express");
var router = express.Router();
const Menu = require("../models/menu");
const stripe = require('stripe')('sk_test_ZPa6gHueecYMJylPMeZKBGSK00f6AtwfDp');
/* GET users listing. */
router.get("/", function(req, res, next) {
  var total_menu = [];
  Menu.find()
    .then(allmenu => {
      allmenu.forEach(function(item) {
        const menu_obj = {
          name: item.name,
          cost: item.cost,
          description: item.description,
          image: item.image
        };
        total_menu.push(menu_obj);
      });
      res.send(total_menu);
    })
    .catch(err => {
      console.log(err);
    });
});

router.post("/post_order", async function(req, res, next) {
  //console.log(req.body);
  var data = req.body;
  var len = data.length;

  var isError = false;
  var total = 0;
  for (var i = 0; i < data.length; i++) {
    var requested_name = data[i].name;
    var requested_quanity = data[i].quantity;
    await Menu.findOne({ name: requested_name })
      .then(foundbody => {
        if (foundbody) {
          var cost = foundbody.cost;
          total = total + cost * requested_quanity;
        } else {
          res.status(400).json({
            message: "Item " + requested_name + " Not found in menu"
          });
          isError = true;
        }
      })
      .catch(err => {
        res.send(err);
      });
  }
  //for loop ends
  if (len >= 4) {
    total = total - (total * 20) / 100;
  }

  if (isError == false) {
    res.send({ total: total });
  }
});

router.post("/menu_name", async function(req, res, next) {
  const menu = new Menu({
    name: req.body.name,
    cost: req.body.cost,
    description: req.body.description,
    image: req.body.image
  });
  console.log('op==',menu);
  menu
    .save()
    .then(createdmenu => {
      console.log(createdmenu);
      res.json({success:true})
    })
    .catch(err => {
      console.log(err);
      res.json({success:false,msg:err});
    });
});

router.post("/payme",(req,res)=>{
  console.log('The body is ',req.body);
  var num = req.body.amount *100;
  console.log("num is " + num);
  var charge = stripe.charges.create({
      amount: num,
      currency: 'usd',
      source: req.body.token
    },(err,charge)=>{
        if(err){
           console.log(err);
           res.json({success:false,msg:err});
        }
        res.json({
            success : true,
            message : "Payment Done"
        })
    });
})

module.exports = router;
