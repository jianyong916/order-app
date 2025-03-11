let orders = [];
let completedOrders = [];
let bots = [];
let orderCounter = 1;

class Order {
    constructor(type, isVIP = false) {
        this.id = orderCounter++;
        this.type = type;
        this.isVIP = isVIP;
        this.status = 'PENDING';
    }
}

class Bot {
    constructor() {
        this.id = bots.length + 1;
        this.isIdle = true;
        this.currentOrder = null;
        this.timeoutId = null;
    }
}

module.exports = { Order, Bot, orders, completedOrders, bots };