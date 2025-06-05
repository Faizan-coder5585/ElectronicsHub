const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  street: { type: String, required: true },
  nearby: { type: String },
  city: { type: String, required: true },
  district: { type: String, required: true },
  state: { type: String, required: true },
  pinCode: { type: String, required: true },
  country: { type: String, default: 'India' },
}, {
  timestamps: true
});

const AddressModel = mongoose.model('Address', addressSchema);

module.exports = AddressModel;
