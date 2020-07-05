 const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create Schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: false
  },
  password: {
    type: String,
    required: false
  },
  isadmin: {
  type: Boolean,
  required: true
  }

});
module.exports = mongoose.model('User',UserSchema);