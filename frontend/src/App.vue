<template>
  <div>
    <h1>Order System</h1>
    <button @click="createNormalOrder">New Normal Order</button>
    <button @click="createVIPOrder">New VIP Order</button>
    <button @click="addBot">+ Bot</button>
    <button @click="removeBot">- Bot</button>

    <div class="row">
        <div class="section">
          <h2>Pending Orders</h2>
          <ul>
            <li v-for="order in pendingOrders" :key="order.id">
              Order #{{ order.id }} ({{ order.isVIP ? 'VIP' : 'Normal' }}) {{ order.status }}
            </li>
          </ul>
        </div>
        <div class="section">
            <h2>Completed Orders</h2>
            <ul>
                <li v-for="order in completedOrders" :key="order.id">
                  Order #{{ order.id }} ({{ order.isVIP ? 'VIP' : 'Normal' }}) {{ order.status }}
                </li>
            </ul>
        </div>
        <div class="section">
          <h2>Bots</h2>
          <ul>
            <li v-for="bot in bots" :key="bot.id">
              Bot #{{ bot.id }} - {{bot.currentOrder ? "Order #" + bot.currentOrder.id : ""}} {{bot.currentOrder ? "Order #" + "(" + bot.currentOrder.type + ")" : ""}} {{ bot.isIdle ? 'IDLE' : 'PROCESSING' }}
            </li>
          </ul>
        </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      orders: [],
      completeOrders: [],
      bots: [],
      pollingInterval: null, // To store the polling interval
    };
  },
  computed: {
    pendingOrders() {
      return this.orders.filter((order) => order.status === 'PENDING');
    },
    completedOrders() {
      return this.completeOrders.filter((order) => order.status === 'COMPLETE');
    },
  },
  methods: {
    async fetchOrders() {
      try {
        const response = await axios.get('http://localhost:3000/orders');
        this.orders = response.data;
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    },
    async fetchCompleteOrders() {
      try {
        const response = await axios.get('http://localhost:3000/orders/complete');
        this.completeOrders = response.data;
      } catch (error) {
        console.error('Error fetching completeOrders:', error);
      }
    },
    async fetchBots() {
      try {
        const response = await axios.get('http://localhost:3000/orders/bots');
        this.bots = response.data;
      } catch (error) {
        console.error('Error fetching bots:', error);
      }
    },
    async createNormalOrder() {
      try {
        await axios.post('http://localhost:3000/orders/create', {
          type: 'Normal',
          isVIP: false,
        });
        this.fetchOrders(); // Refresh orders after creating a new one
      } catch (error) {
        console.error('Error creating normal order:', error);
      }
    },
    async createVIPOrder() {
      try {
        await axios.post('http://localhost:3000/orders/create', {
          type: 'VIP',
          isVIP: true,
        });
        this.fetchOrders();
      } catch (error) {
        console.error('Error creating VIP order:', error);
      }
    },
    async addBot() {
      try {
        await axios.post('http://localhost:3000/orders/bots');
        this.fetchBots(); 
        this.fetchOrders();
      } catch (error) {
        console.error('Error adding bot:', error);
      }
    },
    async removeBot() {
      try {
        await axios.delete('http://localhost:3000/orders/bots');
        this.fetchBots();
        this.fetchOrders();
      } catch (error) {
        console.error('Error removing bot:', error);
      }
    },
    startPolling() {
      this.pollingInterval = setInterval(() => {
        this.fetchOrders();
        this.fetchCompleteOrders();
        this.fetchBots();
      }, 0); 
    },
    stopPolling() {
      if (this.pollingInterval) {
        clearInterval(this.pollingInterval);
        this.pollingInterval = null;
      }
    },
  },
  mounted() {
    this.fetchOrders();
    this.fetchCompleteOrders();
    this.fetchBots();
    this.startPolling();
  },
  beforeUnmount() {
    this.stopPolling();
  },
};
</script>

<style>
    .row {
        display: flex;
    }
    .section {
        flex: 1;
        padding: 10px;
        border: 1px solid #ccc;
        margin: 5px;
    }
</style>