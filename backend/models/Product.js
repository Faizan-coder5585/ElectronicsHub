const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  category: { type: String, required: true },
  brand: { type: String, required: true },
  color: { type: String, required: true },
  images: [
    {
      url: { type: String, required: true },
      public_id: { type: String, required: true },
    },
  ],
  inStock: { type: Boolean, default: true },
  totalRatings: { type: Number, default: 0 },
  averageRating: { type: Number, default: 0 },
  reviews: [reviewSchema], 
});

// Method to calculate ratings
productSchema.methods.calculateRatings = function () {
  if (this.reviews.length > 0) {
    const total = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    this.totalRatings = this.reviews.length;
    this.averageRating = (total / this.reviews.length).toFixed(1);
  } else {
    this.totalRatings = 0;
    this.averageRating = 0;
  }
};

// for uploading images to Cloudinary
productSchema.statics.uploadImages = async function (files) {
  const uploadPromises = files.map(file => {
    return cloudinary.uploader.upload(file.path, {
      folder: '/ElectronicStore/Headphones',
    });
  });


  const results = await Promise.all(uploadPromises);
  return results.map(result => ({
    url: result.secure_url,
    public_id: result.public_id,
  }));
}
const ProdcutModel =  mongoose.model('Product', productSchema);
module.exports = ProdcutModel;