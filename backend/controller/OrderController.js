const OrderModel = require('../models/Order');

// 1. Place a new order
exports.placeOrder = async (req, res) => {
  try {
    const { products, totalAmount } = req.body;

    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: 'No products in the order' });
    }

    const newOrder = new OrderModel({
      userId: req.user._id,
      products,
      totalAmount,
    });

    const savedOrder = await newOrder.save();

    res.status(201).json({
      message: 'Order placed successfully',
      order: savedOrder,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error placing order',
      error: error.message,
    });
  }
};

// 2. Get a specific order by ID
exports.getOrderDetails = async (req, res) => {
  try {
    const order = await OrderModel.findById(req.params.orderId)
      .populate('products.productId');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized access to this order' });
    }

    res.status(200).json({
      message: 'Order fetched successfully',
      order,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching order details',
      error: error.message,
    });
  }
};

// 3. Get all orders for the logged-in user
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await OrderModel.find({ userId: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      message: 'User orders fetched successfully',
      orders,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching user orders',
      error: error.message,
    });
  }
};

// 4. Update payment status of an order
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ message: 'Order ID is required' });
    }

    const order = await OrderModel.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized access to this order' });
    }

    order.paymentStatus = 'Paid';
    order.status = 'Confirmed';

    const updatedOrder = await order.save();

    res.status(200).json({
      message: 'Payment status updated successfully',
      order: updatedOrder,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error updating payment status',
      error: error.message,
    });
  }
};
