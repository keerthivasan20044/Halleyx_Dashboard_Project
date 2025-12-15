import Order from '../models/Order.js';

export const seedOrders = async (req, res) => {
  try {
    // Clear existing orders
    await Order.deleteMany({});

    const mockOrders = [
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe@gmail.com',
        phone: '+1 438 222 7844',
        streetAddress: '798 3E Rue, Apt 4B',
        city: 'Quebec',
        state: 'Quebec',
        postalCode: 'G1J 2V6',
        country: 'Canada',
        product: 'Fiber Internet 300 Mbps',
        quantity: 2,
        unitPrice: 90,
        status: 'Pending',
        createdBy: 'Mr. Michael Harris',
      },
      {
        firstName: 'Peter',
        lastName: 'Parker',
        email: 'peterparker@gmail.com',
        phone: '+1 514 220 9820',
        streetAddress: '120 King Street West, Suite 1600',
        city: 'Toronto',
        state: 'Ontario',
        postalCode: 'M5H 1B3',
        country: 'Canada',
        product: '5G Unlimited Mobile Plan',
        quantity: 1,
        unitPrice: 120,
        status: 'Pending',
        createdBy: 'Mr. Ryan Cooper',
      },
      {
        firstName: 'Emma',
        lastName: 'Wilson',
        email: 'emma.wilson@outlook.com',
        phone: '+1 647 880 4512',
        streetAddress: '55 Bloor St E, Apt 2305',
        city: 'Toronto',
        state: 'Ontario',
        postalCode: 'M4W 1A9',
        country: 'Canada',
        product: 'Fiber Internet 1 Gbps',
        quantity: 2,
        unitPrice: 150,
        status: 'Completed',
        createdBy: 'Mr. Michael Harris',
      },
      {
        firstName: 'Sophia',
        lastName: 'Miller',
        email: 'sophia.miller@gmail.com',
        phone: '+1 450 332 7744',
        streetAddress: '300 Rue Saint-Paul O, Montreal',
        city: 'Montreal',
        state: 'Quebec',
        postalCode: 'H2Y 2A3',
        country: 'Canada',
        product: 'Business Internet 500 Mbps',
        quantity: 1,
        unitPrice: 200,
        status: 'In progress',
        createdBy: 'Ms. Olivia Carter',
      },
      {
        firstName: 'Daniel',
        lastName: 'Clark',
        email: 'daniel.clark@protomail.com',
        phone: '+1 819 995 2233',
        streetAddress: '75 Laurier Ave E',
        city: 'Ottawa',
        state: 'Ontario',
        postalCode: 'K1N 6N5',
        country: 'Canada',
        product: 'VoIP Corporate Package',
        quantity: 1,
        unitPrice: 95,
        status: 'Completed',
        createdBy: 'Mr. Lucas Martin',
      },
    ];

    await Order.insertMany(mockOrders);
    res.json({ message: 'Orders seeded successfully', count: mockOrders.length });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
