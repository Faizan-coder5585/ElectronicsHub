
exports.createTracking = async (req, res) => {
    try {
        const { orderId, trackingNumber } = req.body;
        const tracking = await trackingService.createTracking(orderId, trackingNumber);
        res.status(201).json(tracking);
    } catch (err) {
        res.status(500).json({ message: 'Tracking creation failed', error: err });
    }
}

exports.getTrackingByOrderId = async (req, res) => {
    const { orderId } = req.params;
    try {
      const tracking = await trackingService.getTrackingByOrderId(orderId);
      if (!tracking) return res.status(404).json({ message: 'Tracking not found' });
      res.json(tracking);
    } catch (err) {
      res.status(500).json({ message: 'Error retrieving tracking info', error: err });
    }
}
  
