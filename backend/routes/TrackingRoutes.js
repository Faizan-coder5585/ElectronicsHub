const express = require('express');
const router = express.Router();
const { createTracking, getTrackingByOrderId } = require('../controller/TrackingController.js');

router.post('/', createTracking);
router.get('/:orderId', getTrackingByOrderId )

module.exports = router;
