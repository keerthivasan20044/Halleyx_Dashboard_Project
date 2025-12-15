import Order from '../models/Order.js';

// Get all orders
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single order
export const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create order
export const createOrder = async (req, res) => {
  const { firstName, lastName, email, phone, streetAddress, city, state, postalCode, country, product, quantity, unitPrice, status, createdBy } = req.body;

  try {
    const order = new Order({
      firstName,
      lastName,
      email,
      phone,
      streetAddress,
      city,
      state,
      postalCode,
      country,
      product,
      quantity,
      unitPrice,
      status,
      createdBy,
    });

    const savedOrder = await order.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update order
export const updateOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const { firstName, lastName, email, phone, streetAddress, city, state, postalCode, country, product, quantity, unitPrice, status, createdBy } = req.body;

    if (firstName) order.firstName = firstName;
    if (lastName) order.lastName = lastName;
    if (email) order.email = email;
    if (phone) order.phone = phone;
    if (streetAddress) order.streetAddress = streetAddress;
    if (city) order.city = city;
    if (state) order.state = state;
    if (postalCode) order.postalCode = postalCode;
    if (country) order.country = country;
    if (product) order.product = product;
    if (quantity) order.quantity = quantity;
    if (unitPrice) order.unitPrice = unitPrice;
    if (status) order.status = status;
    if (createdBy) order.createdBy = createdBy;

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete order
export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json({ message: 'Order deleted', orderId: order.orderId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
