const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
  verified: Boolean,
  role: { type: String, default: 'producer' }
});
module.exports = mongoose.model('User', UserSchema);
