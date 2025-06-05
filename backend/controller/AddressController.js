const Address = require('../models/Address');

// 📌 1️⃣ Create a new address
exports.saveAddress = async (req, res) => {
  try {
    const { fullName, street, nearby, city, district, state, pinCode, country } = req.body;

    const newAddress = new Address({
      user: req.user._id,
      fullName,
      street,
      nearby,
      city,
      district,
      state,
      pinCode,
      country,
    });

    const savedAddress = await newAddress.save();
    res.status(201).json({ message: 'Address saved successfully', address: savedAddress });
  } catch (err) {
    console.error('Error saving address:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// 📌 2️⃣ Get all addresses for logged-in user
exports.getAllAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.user._id });
    res.status(200).json(addresses);
  } catch (err) {
    console.error('Error fetching addresses:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// 📌 3️⃣ Get a single address (if owned by user)
exports.getAddressById = async (req, res) => {
  try {
    const address = await Address.findOne({ _id: req.params.id, user: req.user._id });
    if (!address) return res.status(404).json({ message: 'Address not found' });

    res.status(200).json(address);
  } catch (err) {
    console.error('Error fetching address:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// 📌 4️⃣ Update an address (if owned by user)
exports.updateAddress = async (req, res) => {
  try {
    const updatedAddress = await Address.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );

    if (!updatedAddress) return res.status(404).json({ message: 'Address not found' });

    res.status(200).json({ message: 'Address updated successfully', address: updatedAddress });
  } catch (err) {
    console.error('Error updating address:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// 📌 5️⃣ Delete an address (if owned by user)
exports.deleteAddress = async (req, res) => {
  try {
    const deletedAddress = await Address.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if (!deletedAddress) return res.status(404).json({ message: 'Address not found' });

    res.status(200).json({ message: 'Address deleted successfully' });
  } catch (err) {
    console.error('Error deleting address:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
