var express = require("express");
var router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");
const passport = require("passport");

const User = require("../models/userData");
const validateRegisterInput = require("../validation/register");
const validateLoginInput = require("../validation/login");

/* Register */
router.post("/register", async function(req, res, next) {
  //Form Validation
  const {errors,isValid} = validateRegisterInput(req.body);
  if(!isValid){
    return res.status('400').json(errors);
  }
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: "Email already exists" });
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      });

      // Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

/*Login*/

router.post("/login", async function(req, res, next) {
  //Form Validation
  //Form Validation
  const {errors,isValid} = validateLoginInput(req.body);
  if(!isValid){
    return res.status('400').json(errors);
  }

  console.log('here');
  var requested_email= req.body.email;
  var password = req.body.password;
  await User.findOne({email: requested_email}).then(founduser =>
    {
      //if user exists
      if(!founduser){
        return res.status(404).json({ emailnotfound: "Email not found" });
      }
      //check password:
      bcrypt.compare(password, founduser.password).then(isMatch => {
        if (isMatch) {
          // User matched
          // Create JWT Payload
          const payload = {
            id: founduser.id,
            name: founduser.name
          };
  
          // Sign token
          jwt.sign(
            payload,
            keys.secretOrKey,
            {
              expiresIn: 31556926 // 1 year in seconds
            },
            (err, token) => {
              res.json({
                success: true,
                token: "Bearer " + token
              });
            }
          );
        } else {
          return res
            .status(400)
            .json({ passwordincorrect: "Password incorrect" });
        }
      });
    })
});

module.exports = router;
