import { v4 as uuidv4 } from 'uuid';
import { PRODUCTS } from '../constants/products';

const STORAGE_KEY = 'dashboard_orders';

const initialOrders = [
  {
    id: uuidv4(),
    customerId: 'CUST001',
    firstName: 'John',
    lastName: 'Doe',
    customerName: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1-555-0101',
    streetAddress: '123 Main St',
    city: 'New York',
    state: 'NY',
    postalCode: '10001',
    country: 'United States',
    address: '123 Main St, New York, NY 10001',
    orderId: 'ORD001',
    orderDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    product: 'Fiber Internet 300 Mbps',
    quantity: 1,
    unitPrice: 49.99,
    total: 49.99,
    status: 'Completed',
    createdBy: 'Mr. Michael Harris',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: uuidv4(),
    customerId: 'CUST002',
    firstName: 'Jane',
    lastName: 'Smith',
    customerName: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '+1-555-0102',
    streetAddress: '456 Oak Ave',
    city: 'Los Angeles',
    state: 'CA',
    postalCode: '90001',
    country: 'United States',
    address: '456 Oak Ave, Los Angeles, CA 90001',
    orderId: 'ORD002',
    orderDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    product: '5G Unlimited Mobile Plan',
    quantity: 2,
    unitPrice: 79.99,
    total: 159.98,
    status: 'In progress',
    createdBy: 'Ms. Olivia Carter',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: uuidv4(),
    customerId: 'CUST003',
    firstName: 'Bob',
    lastName: 'Johnson',
    customerName: 'Bob Johnson',
    email: 'bob.j@example.com',
    phone: '+1-555-0103',
    streetAddress: '789 Pine Rd',
    city: 'Chicago',
    state: 'IL',
    postalCode: '60601',
    country: 'United States',
    address: '789 Pine Rd, Chicago, IL 60601',
    orderId: 'ORD003',
    orderDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(), // 45 days ago
    product: 'Fiber Internet 1 Gbps',
    quantity: 1,
    unitPrice: 89.99,
    total: 89.99,
    status: 'Pending',
    createdBy: 'Mr. Ryan Cooper',
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const mockDataService = {
  getOrders: () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored || stored === '[]') {
      // Initialize with sample data
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialOrders));
      return initialOrders;
    }
    const orders = JSON.parse(stored);
    // Validate products - if old data exists, reset
    const hasInvalidProducts = orders.some(o => !PRODUCTS.includes(o.product));
    if (hasInvalidProducts || orders.length === 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialOrders));
      return initialOrders;
    }
    return orders;
  },

  createOrder: (order) => {
    const orders = mockDataService.getOrders();
    const newOrder = {
      ...order,
      id: uuidv4(),
      customerId: order.customerId || `CUST${Date.now()}`,
      orderId: order.orderId || `ORD${Date.now()}`,
      customerName: `${order.firstName} ${order.lastName}`,
      address: `${order.streetAddress}, ${order.city}, ${order.state} ${order.postalCode}`,
      total: parseFloat((order.quantity * order.unitPrice).toFixed(2)),
      orderDate: order.orderDate || new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    orders.push(newOrder);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    return newOrder;
  },

  updateOrder: (id, updates) => {
    const orders = mockDataService.getOrders();
    const index = orders.findIndex(o => o.id === id);
    if (index !== -1) {
      const updated = {
        ...orders[index],
        ...updates,
        customerName: `${updates.firstName} ${updates.lastName}`,
        address: `${updates.streetAddress}, ${updates.city}, ${updates.state} ${updates.postalCode}`,
        total: parseFloat((updates.quantity * updates.unitPrice).toFixed(2)),
      };
      orders[index] = updated;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
      return updated;
    }
    return null;
  },

  deleteOrder: (id) => {
    const orders = mockDataService.getOrders();
    const filtered = orders.filter(o => o.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  },

  getDashboardConfig: () => {
    try {
      const config = localStorage.getItem('dashboard_config');
      return config ? JSON.parse(config) : { widgets: [] };
    } catch (error) {
      console.error('Error loading dashboard config:', error);
      return { widgets: [] };
    }
  },

  saveDashboardConfig: (config) => {
    try {
      localStorage.setItem('dashboard_config', JSON.stringify(config));
      return config;
    } catch (error) {
      console.error('Error saving dashboard config:', error);
      throw error;
    }
  },

  resetToSampleData: () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialOrders));
    return initialOrders;
  },
};
