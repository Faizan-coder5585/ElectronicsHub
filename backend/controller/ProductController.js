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
  const { price, category, color, sort, page = 1, limit = 10 } = req.query;

  try {
    let filter = {};

    // Color filter (case-insensitive)
    if (color) {
      filter.color = { $regex: new RegExp(`^${color}$`, "i") };
    }

    // Price filter
    if (price) {
      if (price.includes("-")) {
        const [minPrice, maxPrice] = price.split("-").map(parseFloat);
        filter.price = { $gte: minPrice, $lte: maxPrice };
      } else {
        filter.price = { $lte: parseFloat(price) };
      }
    }

    // Category filter (case-insensitive)
    if (category) {
      filter.category = { $regex: new RegExp(`^${category}$`, "i") };
    }

    // Sorting logic with default sorting as "Recommended"
    let sortOptions = {};
    switch (sort) {
      case "price-asc":
        sortOptions.price = 1;
        break;
      case "price-desc":
        sortOptions.price = -1;
        break;
      case "rating-asc":
        sortOptions.averageRating = 1;
        break;
      case "rating-desc":
        sortOptions.averageRating = -1;
        break;
      default:
        sortOptions.totalRatings = -1;
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const products = await ProductModel.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    const totalProducts = await ProductModel.countDocuments(filter);

    res.status(200).json({
      products,
      totalProducts,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalProducts / parseInt(limit)),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
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

  