import express from 'express';
import Order from '../models/Order.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Transform MongoDB _id to id for frontend
const transformOrder = (order) => {
  const obj = order.toObject();
  obj.id = obj._id.toString();
  delete obj._id;
  delete obj.__v;
  return obj;
};

router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders.map(transformOrder));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const orderData = {
      ...req.body,
      customerId: req.body.customerId || `CUST${Date.now()}`,
      orderId: req.body.orderId || `ORD${Date.now()}`,
      customerName: `${req.body.firstName} ${req.body.lastName}`,
      address: `${req.body.streetAddress}, ${req.body.city}, ${req.body.state} ${req.body.postalCode}`,
      total: parseFloat((req.body.quantity * req.body.unitPrice).toFixed(2)),
      orderDate: req.body.orderDate || new Date(),
    };
    const order = new Order(orderData);
    await order.save();
    res.status(201).json(transformOrder(order));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(transformOrder(order));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const orderData = {
      ...req.body,
      customerName: `${req.body.firstName} ${req.body.lastName}`,
      address: `${req.body.streetAddress}, ${req.body.city}, ${req.body.state} ${req.body.postalCode}`,
      total: parseFloat((req.body.quantity * req.body.unitPrice).toFixed(2)),
    };
    const order = await Order.findByIdAndUpdate(req.params.id, orderData, { new: true, runValidators: true });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(transformOrder(order));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json({ message: 'Order deleted', id: req.params.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
