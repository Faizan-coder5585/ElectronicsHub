const WishlistModel = require('../models/WishListProduct.js');
const ProductModel = require('../models/Product.js');


// 🟢 Get wishlist for current user
exports.getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user.id }).populate('products');
    if (!wishlist) return res.status(200).json({ products: [] });

    res.status(200).json({ products: wishlist.products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ➕ Add product to wishlist
exports.addToWishlist = async (req, res) => {
  const { productId } = req.body;

  try {
    const product = await  ProductModel.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const wishlist = await WishlistModel.findOneAndUpdate(
      { user: req.user.id },
      { $addToSet: { products: productId } }, // prevents duplicates
      { new: true, upsert: true } // create if not exist
    ).populate('products');

    res.status(200).json({ message: 'Product added to wishlist', wishlist: wishlist.products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ❌ Remove product from wishlist
exports.removeFromWishlist = async (req, res) => {
  const { productId } = req.params;

  try {
    const wishlist = await WishlistModel.findOneAndUpdate(
      { user: req.user.id },
      { $pull: { products: productId } },
      { new: true }
    ).populate('products');

    if (!wishlist) return res.status(404).json({ message: 'Wishlist not found' });

    res.status(200).json({ message: 'Product removed from wishlist', wishlist: wishlist.products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🗑️ Delete entire wishlist
exports.clearWishlist = async (req, res) => {
  try {
    await WishlistModel.findOneAndDelete({ user: req.user.id });
    res.status(200).json({ message: 'Wishlist cleared' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
