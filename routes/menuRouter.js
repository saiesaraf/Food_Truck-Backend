var express = require("express");
var router = express.Router();
const Menu = require("../models/menu");

/* GET users listing. */
router.get("/", function(req, res, next) {
  var total_menu = [];
  Menu.find()
    .then(allmenu => {
      allmenu.forEach(function(item) {
        const menu_obj = {
          name: item.name,
          cost: item.cost
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
    cost: req.body.cost
  });
  menu
    .save()
    .then(createdmenu => {
      console.log(createdmenu);
      res.status(201).json({
        message: "New menu is added successfully"
      });
    })
    .catch(err => {
      console.log(err);
    });
});

module.exports = router;
