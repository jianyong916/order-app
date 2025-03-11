const express = require('express');
const { createOrder, addBot, removeBot, getOrders, getBots, getCompletedOrders } = require('../controllers/orderController');

const router = express.Router();

router.get('/', getOrders);
router.get('/complete', getCompletedOrders);
router.get('/bots', getBots);
router.post('/create', createOrder);
router.post('/bots', addBot);
router.delete('/bots', removeBot);


module.exports = router;