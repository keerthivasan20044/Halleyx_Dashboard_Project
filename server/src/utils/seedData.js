import Order from '../models/Order.js';

const sampleOrders = [
  {
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
    orderDate: new Date('2024-01-15'),
    product: 'Fiber Internet 300 Mbps',
    quantity: 1,
    unitPrice: 49.99,
    total: 49.99,
    status: 'Completed',
    createdBy: 'Mr. Michael Harris',
  },
  {
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
    orderDate: new Date('2024-01-20'),
    product: '5G Unlimited Mobile Plan',
    quantity: 2,
    unitPrice: 79.99,
    total: 159.98,
    status: 'In progress',
    createdBy: 'Ms. Olivia Carter',
  },
  {
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
    orderDate: new Date('2024-02-01'),
    product: 'Fiber Internet 1 Gbps',
    quantity: 1,
    unitPrice: 89.99,
    total: 89.99,
    status: 'Pending',
    createdBy: 'Mr. Ryan Cooper',
  },
];

export const seedOrders = async () => {
  try {
    const count = await Order.countDocuments();
    if (count === 0) {
      await Order.insertMany(sampleOrders);
      console.log('✓ Sample orders seeded');
    }
  } catch (error) {
    console.error('Error seeding orders:', error.message);
  }
};
