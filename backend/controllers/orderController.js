const { Order, Bot, orders, completedOrders, bots } = require('../models/order');

let desstroyBotOrder = [];

const createOrder = (req, res) => {
    const { type, isVIP } = req.body;
    const newOrder = new Order(type, isVIP);

    if (isVIP) {
        // Add VIP order to the front of the queue, but behind other VIP orders
        const lastVIPIndex = orders.findIndex(order => !order.isVIP);
        if (lastVIPIndex === -1) {
            orders.push(newOrder);
        } else {
            orders.splice(lastVIPIndex, 0, newOrder);
        }
    } else {
        orders.push(newOrder);
    }

    processBots();
    res.status(201).json(newOrder);
};

const addBot = (req, res) => {
    const newBot = new Bot();
    bots.push(newBot);
    processBots();
    desstroyBotOrder = [];
    res.status(201).json(newBot);
};

const processBots = () => {
    bots.forEach(bot => {
        if (bot.isIdle && orders.length > 0) {
            const order = orders.shift();
            bot.isIdle = false;
            bot.currentOrder = order;

            setTimeout(() => {
                if(!desstroyBotOrder.find(bot => bot.currentOrder && bot.currentOrder.id === order.id)){
                    order.status = 'COMPLETE';

                    const orderIndex = completedOrders.findIndex(
                        (order) => order.id === bot.currentOrder.id
                    );
                    if (orderIndex === -1) {
                        completedOrders.push(order);
                    }

                    bot.isIdle = true;
                    bot.currentOrder = null;

                    processBots();
                }
            }, 10000);
        }
    });
};

const removeBot = (req, res) => {
    if (bots.length > 0) {
        const bot = bots.pop();
        desstroyBotOrder.push(bot);
        if (bot.currentOrder) {
            orders.unshift(bot.currentOrder);
        }
        res.status(200).json(bot);
    } else {
        res.status(400).json({ message: 'No bots to remove' });
    }
};

const getOrders = (req, res) => {
    res.status(200).json(orders);
};

const getBots = (req, res) => {
    res.status(200).json(bots);
};

// Add a new endpoint to get completed orders
const getCompletedOrders = (req, res) => {
    res.status(200).json(completedOrders);
};

module.exports = { createOrder, addBot, removeBot, getOrders, getBots, getCompletedOrders };