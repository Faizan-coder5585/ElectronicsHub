const ProductModel = require('../models/Product.js');

exports.createProduct = async (req, res) => {
    try {
        const product = new ProductModel(req.body);
        const savedProduct = await product.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

exports.getAllProducts = async (req, res) => {
  try {
    let { price, category, color, sort, page = 1, limit = 10 } = req.query;

    // Convert to numbers and validate pagination parameters
    page = Number(page) || 1;
    limit = Number(limit) || 10;

    let filter = {};

    // Color filter (case-insensitive)
    if (color) {
      filter.color = { $regex: new RegExp(color, "i") };
    }

    // Price filter
    if (price) {
      const [minPrice, maxPrice] = price.split("-").map(Number);
      if (!isNaN(minPrice) && !isNaN(maxPrice)) {
        filter.price = { $gte: minPrice, $lte: maxPrice };
      } else if (!isNaN(minPrice)) {
        filter.price = { $lte: minPrice };
      }
    }

    // Category filter (case-insensitive)
    if (category) {
      filter.category = { $regex: new RegExp(category, "i") };
    }

    // Sorting options
    const sortOptions = {
      "price-asc": { price: 1 },
      "price-desc": { price: -1 },
      "rating-asc": { averageRating: 1 },
      "rating-desc": { averageRating: -1 },
      default: { totalRatings: -1 },
    };

    // Apply sorting
    const sorting = sortOptions[sort] || sortOptions.default;

    // Pagination
    const skip = (page - 1) * limit;

    // Fetch Products
    const products = await ProductModel.find(filter)
      .sort(sorting)
      .skip(skip)
      .limit(limit);

    const totalProducts = await ProductModel.countDocuments(filter);

    res.status(200).json({
      products,
      totalProducts,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await ProductModel.findById(id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedProduct = await ProductModel.findByIdAndUpdate(id, req.body, {
            new: true,  
            runValidators: true, 
        });
        if (!updatedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedProduct = await ProductModel.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.addReview = async (req, res) => {
    const { user, rating, comment } = req.body;
  
    try {
      const product = await ProductModel.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      // Check if user already reviewed
      const existingReview = product.reviews.find(
        (rev) => rev.user.toString() === user
      );
      if (existingReview) {
        return res.status(400).json({ message: 'You have already reviewed this product' });
      }
  
      // Add new review
      product.reviews.push({ user, rating, comment });
  
      // Calculate total and average ratings using method
      product.calculateRatings();
  
      await product.save();
      res.status(201).json({
        message: 'Review added',
        totalRatings: product.totalRatings,
        averageRating: product.averageRating,
        product,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  exports.getProductReviews = async (req, res) => {
    try {
      const product = await ProductModel.findById(req.params.id).populate('reviews.user', 'name email');
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      res.status(200).json({
        totalRatings: product.totalRatings,
        averageRating: product.averageRating,
        reviews: product.reviews,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};

exports.getAllProductsReviews = async (req, res) => {
  try {
    const products = await ProductModel.find().populate('reviews.user', 'name email');
    const allReviews = products.flatMap(product =>
      product.reviews.map(review => ({
        productId: product._id,
        productName: product.name,
        ...review._doc
      }))
    );

    res.status(200).json(allReviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.updateReview = async (req, res) => {
  const { rating, comment } = req.body;
  const { productId, reviewId } = req.params;

  try {
    const product = await ProductModel.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const review = product.reviews.id(reviewId);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    if (rating) review.rating = rating;
    if (comment) review.comment = comment;

    product.calculateRatings();
    await product.save();

    res.status(200).json({
      message: 'Review updated successfully',
      product,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.deleteReview = async (req, res) => {
  const { productId, reviewId } = req.params;

  try {
    const product = await ProductModel.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const reviewIndex = product.reviews.findIndex((rev) => rev._id.toString() === reviewId);
    if (reviewIndex === -1) return res.status(404).json({ message: 'Review not found' });

    product.reviews.splice(reviewIndex, 1);
    product.calculateRatings();

    await product.save();

    res.status(200).json({
      message: 'Review deleted successfully',
      product,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

  