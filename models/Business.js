const mongoose = require('mongoose');
const BusinessSchema = new mongoose.Schema({
  name: String,
  phone: String,
  description: String,
  location: {
    lat: Number,
    lng: Number,
  },
});
module.exports = mongoose.model('Business', BusinessSchema);
