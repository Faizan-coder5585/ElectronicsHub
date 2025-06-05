const CartModel = require('../models/CartProduct.js');  // Import Cart model
const ProductModel = require('../models/Product.js');  // Import Product model

exports.addToCart = async (req, res) => {
    try {
        console.log('Request Body:', req.body); // Log the request body
        const { userId, productId, quantity } = req.body;

        if (!Number.isInteger(quantity) || quantity <= 0) {
            return res.status(400).json({ error: 'Quantity must be a positive integer' });
        }

        const product = await ProductModel.findById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        let cart = await CartModel.findOne({ user: userId });
        if (!cart) {
            cart = new CartModel({ user: userId, items: [] });
        }

        const existingItem = cart.items.find(item => item.product.toString() === productId);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({ product: productId, quantity });
        }

        await cart.save();

        console.log('Updated Cart:', cart); // Log the updated cart
        res.status(200).json(cart);
    } catch (error) {
        console.error('Error:', error.message); // Log the error
        res.status(500).json({ error: error.message });
    }
};

exports.getCart = async (req, res) => {
    try {
        const { userId } = req.params;
        console.log('User ID:', userId);  // Log the userId to check if it is correct

        // Check if the cart exists for the user
        let cart = await CartModel.findOne({ user: userId }).populate('items.product');
        console.log(cart);
        
        // If no cart found, create a new cart for the user
        if (!cart) {
            cart = new CartModel({
                user: userId,
                items: [],  // Initially, no items in the cart
            });
            await cart.save();
        }

        res.status(200).json(cart);  // Return the user's cart (either existing or newly created)
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateCartItem = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;

        // Validate quantity
        if (!Number.isInteger(quantity) || quantity <= 0) {
            return res.status(400).json({ error: 'Quantity must be a positive integer' });
        }

        // Find the user's cart
        let cart = await CartModel.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        // Find the item in the cart
        const cartItem = cart.items.find(item => item.product.toString() === productId);
        if (!cartItem) {
            return res.status(404).json({ error: 'Product not found in cart' });
        }

        // Update the quantity of the cart item
        cartItem.quantity = quantity;

        // Save the updated cart
        await cart.save();

        res.status(200).json(cart);  // Return the updated cart
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.removeFromCart = async (req, res) => {
    try {
        const { userId, productId } = req.body;

        // Find the user's cart
        let cart = await CartModel.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        // Remove the item from the cart
        cart.items = cart.items.filter(item => item.product.toString() !== productId);

        // Save the updated cart
        await cart.save();

        res.status(200).json(cart);  // Return the updated cart
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

