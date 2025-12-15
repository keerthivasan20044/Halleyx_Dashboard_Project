import axios from 'axios'

const LS_ORDERS = 'orders'
const LS_WIDGETS = 'widgets'

// --- Simple pub/sub to broadcast data changes ---
const ordersSubscribers = new Set()
const widgetsSubscribers = new Set()

export function subscribeOrders(cb) {
  ordersSubscribers.add(cb)
  return () => ordersSubscribers.delete(cb)
}
export function subscribeWidgets(cb) {
  widgetsSubscribers.add(cb)
  return () => widgetsSubscribers.delete(cb)
}
function notifyOrdersChanged() {
  const data = getOrdersSafe()
  ordersSubscribers.forEach(cb => {
    try { cb(data) } catch {}
  })
}
function notifyWidgetsChanged() {
  const data = getWidgetsSafe()
  widgetsSubscribers.forEach(cb => {
    try { cb(data) } catch {}
  })
}

// --- Seed with demo orders for offline mode ---
function seed() {
  if (!localStorage.getItem(LS_ORDERS)) {
    const now = Date.now()
    const demo = [
      { _id: 'mock-1', firstName: 'Olivia', lastName: 'Carter', email: 'olivia.carter@example.com', phone: '555-1010', street: '1 Market St', city: 'San Francisco', state: 'CA', postalCode: '94103', country: 'United States', product: 'Fiber Internet 300 Mbps', quantity: 2, unitPrice: 49, status: 'Pending', createdBy: 'Ms. Olivia Carter', createdAt: new Date(now - 11*24*3600*1000).toISOString() },
      { _id: 'mock-2', firstName: 'Lucas', lastName: 'Martin', email: 'lucas.martin@example.com', phone: '555-2020', street: '200 King St', city: 'Toronto', state: 'ON', postalCode: 'M5V', country: 'Canada', product: '5G Unlimited Mobile Plan', quantity: 3, unitPrice: 35, status: 'Completed', createdBy: 'Mr. Lucas Martin', createdAt: new Date(now - 12*24*3600*1000).toISOString() },
      { _id: 'mock-3', firstName: 'Ryan', lastName: 'Cooper', email: 'ryan.cooper@example.com', phone: '555-3030', street: '77 George St', city: 'Sydney', state: 'NSW', postalCode: '2000', country: 'Australia', product: 'Fiber Internet 1 Gbps', quantity: 1, unitPrice: 79, status: 'In progress', createdBy: 'Mr. Ryan Cooper', createdAt: new Date(now - 10*24*3600*1000).toISOString() },
      { _id: 'mock-4', firstName: 'Michael', lastName: 'Harris', email: 'michael.harris@example.com', phone: '555-4040', street: '2 Raffles Pl', city: 'Singapore', state: '', postalCode: '048617', country: 'Singapore', product: 'Business Internet 500 Mbps', quantity: 5, unitPrice: 99, status: 'Completed', createdBy: 'Mr. Michael Harris', createdAt: new Date(now - 9*24*3600*1000).toISOString() },
      { _id: 'mock-5', firstName: 'Ava', lastName: 'Ng', email: 'ava.ng@example.com', phone: '555-5050', street: '1 Queen Rd', city: 'Hong Kong', state: '', postalCode: '00000', country: 'Hong Kong', product: 'VoIP Corporate Package', quantity: 10, unitPrice: 15, status: 'Pending', createdBy: 'Ms. Olivia Carter', createdAt: new Date(now - 8*24*3600*1000).toISOString() },
      { _id: 'mock-6', firstName: 'Noah', lastName: 'Smith', email: 'noah.smith@example.com', phone: '555-6060', street: '500 5th Ave', city: 'New York', state: 'NY', postalCode: '10018', country: 'United States', product: 'Fiber Internet 1 Gbps', quantity: 2, unitPrice: 79, status: 'Completed', createdBy: 'Mr. Ryan Cooper', createdAt: new Date(now - 7*24*3600*1000).toISOString() },
      { _id: 'mock-7', firstName: 'Mia', lastName: 'Lee', email: 'mia.lee@example.com', phone: '555-7070', street: '300 Bay St', city: 'Toronto', state: 'ON', postalCode: 'M5J', country: 'Canada', product: '5G Unlimited Mobile Plan', quantity: 4, unitPrice: 35, status: 'In progress', createdBy: 'Mr. Lucas Martin', createdAt: new Date(now - 6*24*3600*1000).toISOString() },
      { _id: 'mock-8', firstName: 'Ethan', lastName: 'Wong', email: 'ethan.wong@example.com', phone: '555-8080', street: '8 Marina Blvd', city: 'Singapore', state: '', postalCode: '018981', country: 'Singapore', product: 'Fiber Internet 300 Mbps', quantity: 1, unitPrice: 49, status: 'Pending', createdBy: 'Mr. Michael Harris', createdAt: new Date(now - 5*24*3600*1000).toISOString() }
    ].map((o, i) => ({ ...o, totalAmount: (o.quantity || 0) * (o.unitPrice || 0), orderId: `ORD - ${String(i+1).padStart(4,'0')}` }))
    localStorage.setItem(LS_ORDERS, JSON.stringify(demo))
  }
  if (!localStorage.getItem(LS_WIDGETS)) {
    const demoWidgets = [
      {
        id: 'demo-kpi-revenue',
        type: 'kpi',
        title: 'Total Revenue',
        description: 'Sum of total amount',
        config: { metric: 'totalAmount', agg: 'Sum', format: 'Currency', precision: 0 },
        layout: {
          lg: { i: 'demo-kpi-revenue', x: 0, y: 0, w: 3, h: 6 },
          md: { i: 'demo-kpi-revenue', x: 0, y: 0, w: 4, h: 6 },
          sm: { i: 'demo-kpi-revenue', x: 0, y: 0, w: 4, h: 6 }
        }
      },
      {
        id: 'demo-kpi-orders',
        type: 'kpi',
        title: 'Total Orders',
        description: 'Count of orders',
        config: { agg: 'Count', format: 'Number', precision: 0 },
        layout: {
          lg: { i: 'demo-kpi-orders', x: 3, y: 0, w: 3, h: 6 },
          md: { i: 'demo-kpi-orders', x: 4, y: 0, w: 4, h: 6 },
          sm: { i: 'demo-kpi-orders', x: 0, y: 6, w: 4, h: 6 }
        }
      },
      {
        id: 'demo-bar-revenue-product',
        type: 'bar',
        title: 'Revenue by Product',
        description: 'Sum of total amount by product',
        config: { x: 'product', y: 'totalAmount', agg: 'Sum', color: '#10b981', showLabel: true },
        layout: {
          lg: { i: 'demo-bar-revenue-product', x: 6, y: 0, w: 6, h: 12 },
          md: { i: 'demo-bar-revenue-product', x: 0, y: 6, w: 8, h: 12 },
          sm: { i: 'demo-bar-revenue-product', x: 0, y: 12, w: 4, h: 12 }
        }
      },
      {
        id: 'demo-pie-orders-status',
        type: 'pie',
        title: 'Orders by Status',
        description: 'Distribution of orders by status',
        config: { pieDim: 'status', agg: 'Count', legend: true },
        layout: {
          lg: { i: 'demo-pie-orders-status', x: 0, y: 6, w: 6, h: 12 },
          md: { i: 'demo-pie-orders-status', x: 0, y: 18, w: 4, h: 12 },
          sm: { i: 'demo-pie-orders-status', x: 0, y: 24, w: 4, h: 12 }
        }
      },
      {
        id: 'demo-line-quantity-country',
        type: 'line',
        title: 'Quantity by Country',
        description: 'Total quantity by country',
        config: { x: 'country', y: 'quantity', agg: 'Sum', color: '#0ea5e9', showLabel: false },
        layout: {
          lg: { i: 'demo-line-quantity-country', x: 6, y: 12, w: 6, h: 12 },
          md: { i: 'demo-line-quantity-country', x: 0, y: 30, w: 8, h: 12 },
          sm: { i: 'demo-line-quantity-country', x: 0, y: 36, w: 4, h: 12 }
        }
      },
      {
        id: 'demo-table-recent',
        type: 'table',
        title: 'Recent Orders',
        description: 'Key order fields',
        config: { cols: ['firstName','lastName','email','product','quantity','totalAmount','status'], sortBy: 'firstName', pageSize: '5', filter: false, fontSize: 14, theadBg: '#f8fafc' },
        layout: {
          lg: { i: 'demo-table-recent', x: 0, y: 18, w: 12, h: 16 },
          md: { i: 'demo-table-recent', x: 0, y: 42, w: 8, h: 16 },
          sm: { i: 'demo-table-recent', x: 0, y: 48, w: 4, h: 16 }
        }
      }
    ]
    localStorage.setItem(LS_WIDGETS, JSON.stringify(demoWidgets))
  }
}
seed()

// --- Accessors ---
export function getOrdersSafe() {
  return JSON.parse(localStorage.getItem(LS_ORDERS) || '[]')
}
export function getWidgetsSafe() {
  return JSON.parse(localStorage.getItem(LS_WIDGETS) || '[]')
}

// --- Widgets API with fallback ---
export async function fetchWidgets() {
  try {
    const { data } = await axios.get('/api/dashboard')
    localStorage.setItem(LS_WIDGETS, JSON.stringify(data || []))
    notifyWidgetsChanged()
    return data || []
  } catch {
    const local = getWidgetsSafe()
    notifyWidgetsChanged()
    return local
  }
}
export async function saveWidgets(widgets) {
  try {
    const { data } = await axios.post('/api/dashboard', widgets)
    localStorage.setItem(LS_WIDGETS, JSON.stringify(data || widgets))
    notifyWidgetsChanged()
    return data || widgets
  } catch {
    localStorage.setItem(LS_WIDGETS, JSON.stringify(widgets))
    notifyWidgetsChanged()
    return widgets
  }
}

// --- Orders API with fallback ---
export async function fetchOrders() {
  try {
    const { data } = await axios.get('/api/orders')
    localStorage.setItem(LS_ORDERS, JSON.stringify(data))
    notifyOrdersChanged()
    return data
  } catch {
    const local = getOrdersSafe()
    notifyOrdersChanged()
    return local
  }
}
export async function saveOrder(order) {
  try {
    if (order._id) {
      await axios.put(`/api/orders/${order._id}`, order)
    } else {
      await axios.post('/api/orders', order)
    }
    return await fetchOrders()
  } catch {
    // offline fallback mutate locally
    const cur = getOrdersSafe()
    if (order._id) {
      const idx = cur.findIndex(x => x._id === order._id)
      if (idx !== -1) cur[idx] = { ...cur[idx], ...order, totalAmount: (order.quantity || 0) * (order.unitPrice || 0) }
    } else {
      const id = (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : `mock-${Date.now()}`
      const nextOrderNum = cur.length + 1
      cur.push({ ...order, _id: id, orderId: `ORD - ${String(nextOrderNum).padStart(4,'0')}`, totalAmount: (order.quantity || 0) * (order.unitPrice || 0), createdAt: new Date().toISOString() })
    }
    localStorage.setItem(LS_ORDERS, JSON.stringify(cur))
    notifyOrdersChanged()
    return cur
  }
}
export async function deleteOrder(id) {
  try {
    await axios.delete(`/api/orders/${id}`)
    return await fetchOrders()
  } catch {
    const cur = getOrdersSafe().filter(o => o._id !== id)
    localStorage.setItem(LS_ORDERS, JSON.stringify(cur))
    notifyOrdersChanged()
    return cur
  }
}
