var express = require("express");
var router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");
const passport = require("passport");

const User = require("../models/userData");

const validateRegisterInput = require("../validation/register");
const validateLoginInput = require("../validation/login");

/*admin registration*/
const mainadmin = new User({
    name: "saieAdmin",
    email: "saie1.saraf@gmail.com",
    password: "Omsaie@1234",
    isadmin: true
  })
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(mainadmin.password, salt, (err, hash) => {
      if (err) throw err;
      mainadmin.password = hash;
      mainadmin
        .save()
        .then(user => console.log(mainadmin))
        .catch();
    });
  });


console.log(mainadmin);

/* Register */
router.post("/register", async function(req, res, next) {
  //Form Validation
  const {errors,isValid} = validateRegisterInput(req.body);
  if(!isValid){
    console.log(errors);
    res.json({success: false,msg:errors});
  }
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      res.json({success: false, msg: "Email already exists" });
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        isadmin: false
      })

      // Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json({success:true}))
            .catch(err => res.json({success:false,msg:err}));
        });
      });
    }
  }).catch(err=> res.json({success:false,msg:err}))
  ;
});

/*Login*/

router.post("/login", async function(req, res, next) {
  //Form Validation
  //Form Validation
  const {errors,isValid} = validateLoginInput(req.body);
  if(!isValid){
    res.json({success: false,msg:errors});
  }

  console.log('here');
  var requested_email= req.body.email;
  var password = req.body.password;
  await User.findOne({email: requested_email}).then(founduser =>
    {
      //if user exists
      if(!founduser){
        res.json({success:false, msg:"User does not exist"})
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
                token: "Bearer " + token,
                user:founduser
              });
            }
          );
        } else {
             res
            .json({ success:false, msg: "Password incorrect" });
        }
      });
    })
});

router.get("/userdetails/:id",async function(req,res,next)
{
  await User.findOne({ email: req.params.id}).then(user => {
    if(user)
    {
      res.send( 
        {
          email:user.email,
          name:user.name
        }
      )
    }
    else{
      return res
            .status(400)
            .json({ userfound: "User not found" });
        }
      });
});

module.exports = router;
