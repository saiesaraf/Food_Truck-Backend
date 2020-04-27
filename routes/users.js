var express = require("express");
var router = express.Router();
const User = require("../models/userData");
/* Register */
router.post("/register", async function(req, res, next) {
  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  });
  newUser
    .save()
    .then(createduser => {
      console.log(createduser);
      res.status(201).json({
        message: "New user is registered"
      });
    })
    .catch(err => {
      console.log(err);
    });
});

/*Login*/

router.post("/login", async function(req, res, next) {
  var requested_name = req.body.name;
  await User.findOne({ name: requested_name })
      .then(foundbody => {
        if (foundbody) {

          res.status(201).json({
            message: "User is logged in"
          });
        } else {
          res.status(400).json({
            message: "name " + requested_name + " Not found registered"
          });
          isError = true;
        }
      })
      .catch(err => {
        res.send(err);
      });
});

module.exports = router;
