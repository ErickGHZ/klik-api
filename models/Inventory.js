const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  coins: { type: Number, default: 0 },
  diamonds: { type: Number, default: 0 },
  level: { type: Number, default: 0 },
  exp: { type: Number, default: 0 },
});

module.exports = mongoose.model('Inventory', inventorySchema);
