import Order from '../models/Order.js'
import DashboardConfig from '../models/DashboardConfig.js'
import { sendSuccess } from '../utils/response.js'

const generateMockOrders = (count = 20) => {
  const products = [
    'Fiber Internet 300 Mbps',
    '5G Unlimited Mobile Plan',
    'Fiber Internet 1 Gbps',
    'Business Internet Pro',
    'Premium WiFi Mesh System',
    'Cloud Storage Plus',
    'VPN Professional',
    'Email Protection Suite',
  ]

  const creators = [
    'Mr. Michael Harris',
    'Mr. Ryan Cooper',
    'Ms. Olivia Carter',
    'Mr. Lucas Martin',
    'Ms. Emma Thompson',
    'Mr. James Wilson',
    'Ms. Sarah Anderson',
    'Mr. David Brown',
  ]

  const statuses = ['Pending', 'In Progress', 'Completed']
  const countries = ['US', 'Canada', 'Australia', 'Singapore', 'Hong Kong']

  const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emma', 'James', 'Olivia']
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis']

  const orders = []

  for (let i = 0; i < count; i++) {
    const quantity = Math.floor(Math.random() * 5) + 1
    const unitPrice = Math.floor(Math.random() * 500) + 50
    const total = quantity * unitPrice

    orders.push({
      customer: {
        firstName: firstNames[Math.floor(Math.random() * firstNames.length)],
        lastName: lastNames[Math.floor(Math.random() * lastNames.length)],
        email: `customer${i}@example.com`,
        phone: `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`,
        address: `${Math.floor(Math.random() * 1000)} Main Street`,
        city: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'][Math.floor(Math.random() * 5)],
        state: ['NY', 'CA', 'IL', 'TX', 'AZ'][Math.floor(Math.random() * 5)],
        postalCode: `${Math.floor(Math.random() * 90000) + 10000}`,
        country: countries[Math.floor(Math.random() * countries.length)],
      },
      order: {
        product: products[Math.floor(Math.random() * products.length)],
        quantity,
        unitPrice,
        total,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        createdBy: creators[Math.floor(Math.random() * creators.length)],
      },
      createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
    })
  }

  return orders
}

const generateMockDashboardConfig = () => {
  return {
    userId: 'default',
    layout: [
      { i: '1', x: 0, y: 0, w: 3, h: 3, static: false },
      { i: '2', x: 3, y: 0, w: 3, h: 3, static: false },
      { i: '3', x: 6, y: 0, w: 3, h: 3, static: false },
      { i: '4', x: 9, y: 0, w: 3, h: 3, static: false },
    ],
    widgets: [
      {
        id: '1',
        type: 'KPI',
        config: { title: 'Total Orders', metric: 'order.quantity', aggregation: 'Sum' },
        position: { x: 0, y: 0, w: 3, h: 3 },
      },
      {
        id: '2',
        type: 'KPI',
        config: { title: 'Revenue', metric: 'order.total', aggregation: 'Sum' },
        position: { x: 3, y: 0, w: 3, h: 3 },
      },
      {
        id: '3',
        type: 'KPI',
        config: { title: 'Completed Orders', metric: 'order.status', aggregation: 'Count' },
        position: { x: 6, y: 0, w: 3, h: 3 },
      },
      {
        id: '4',
        type: 'KPI',
        config: { title: 'Avg Order Value', metric: 'order.total', aggregation: 'Average' },
        position: { x: 9, y: 0, w: 3, h: 3 },
      },
    ],
  }
}

export const seedDatabase = async (req, res, next) => {
  try {
    // Clear existing data
    await Order.deleteMany({})
    await DashboardConfig.deleteMany({})

    // Create mock orders
    const orders = generateMockOrders(20)
    const createdOrders = await Order.insertMany(orders)

    // Create mock dashboard config
    const config = generateMockDashboardConfig()
    const dashboardConfig = new DashboardConfig(config)
    await dashboardConfig.save()

    sendSuccess(res, {
      message: 'Database seeded successfully',
      ordersCreated: createdOrders.length,
      configCreated: true,
    }, 201)
  } catch (error) {
    next(error)
  }
}
