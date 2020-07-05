const mongoose = require('mongoose');

var Order = mongoose.Schema;

var OrderSchema = new Order({
  //orderId?: String,
  email: String,
  items: [
  {
    name: String,
    cost: Number,
    description: String,
    quantity: Number
  }
],
total: Number,
placedOrderDate: Date
});

module.exports = mongoose.model('Order',OrderSchema);