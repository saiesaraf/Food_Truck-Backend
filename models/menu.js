const mongoose = require('mongoose');

var Menu = mongoose.Schema;

var MenuSchema = new Menu({
  name: String,
  cost: Number
});

module.exports = mongoose.model('Menu',MenuSchema);