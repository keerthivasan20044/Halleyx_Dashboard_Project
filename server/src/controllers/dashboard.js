import Dashboard from '../models/Dashboard.js';
import Order from '../models/Order.js';

// Get dashboard configuration
export const getDashboard = async (req, res) => {
  try {
    let dashboard = await Dashboard.findOne({ userId: 'default' });
    if (!dashboard) {
      dashboard = new Dashboard({ 
        userId: 'default',
        isConfigured: false, 
        widgets: [] 
      });
      await dashboard.save();
    }
    
    // Filter only active widgets
    const activeWidgets = dashboard.widgets.filter(w => w.isActive !== false);
    
    res.json({
      ...dashboard.toObject(),
      widgets: activeWidgets
    });
  } catch (error) {
    console.error('Dashboard get error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Save dashboard configuration
export const saveDashboard = async (req, res) => {
  try {
    const { widgets, dateFilter } = req.body;

    let dashboard = await Dashboard.findOne({ userId: 'default' });
    if (!dashboard) {
      dashboard = new Dashboard({ userId: 'default' });
    }

    // Ensure all widgets have required fields
    const processedWidgets = widgets.map(widget => ({
      ...widget,
      isActive: true,
      config: {
        ...widget.config,
        title: widget.config?.title || 'Untitled Chart',
        color: widget.config?.color || '#10b981'
      }
    }));

    dashboard.widgets = processedWidgets;
    dashboard.dateFilter = dateFilter || 'all';
    dashboard.isConfigured = processedWidgets.length > 0;

    const savedDashboard = await dashboard.save();
    
    res.json({
      ...savedDashboard.toObject(),
      widgets: savedDashboard.widgets.filter(w => w.isActive !== false)
    });
  } catch (error) {
    console.error('Dashboard save error:', error);
    res.status(400).json({ message: error.message });
  }
};

// Delete specific widget
export const deleteWidget = async (req, res) => {
  try {
    const { widgetId } = req.params;
    
    let dashboard = await Dashboard.findOne({ userId: 'default' });
    if (!dashboard) {
      return res.status(404).json({ message: 'Dashboard not found' });
    }

    // Mark widget as inactive instead of removing
    const widgetIndex = dashboard.widgets.findIndex(w => w.id === widgetId);
    if (widgetIndex === -1) {
      return res.status(404).json({ message: 'Widget not found' });
    }

    dashboard.widgets[widgetIndex].isActive = false;
    dashboard.isConfigured = dashboard.widgets.some(w => w.isActive !== false);
    
    await dashboard.save();
    
    res.json({ message: 'Widget deleted successfully' });
  } catch (error) {
    console.error('Widget delete error:', error);
    res.status(400).json({ message: error.message });
  }
};

// Add single widget
export const addWidget = async (req, res) => {
  try {
    const widget = req.body;
    
    let dashboard = await Dashboard.findOne({ userId: 'default' });
    if (!dashboard) {
      dashboard = new Dashboard({ userId: 'default' });
    }

    const newWidget = {
      ...widget,
      isActive: true,
      config: {
        ...widget.config,
        title: widget.config?.title || 'New Chart',
        color: widget.config?.color || '#10b981'
      }
    };

    dashboard.widgets.push(newWidget);
    dashboard.isConfigured = true;
    
    await dashboard.save();
    
    res.json(newWidget);
  } catch (error) {
    console.error('Widget add error:', error);
    res.status(400).json({ message: error.message });
  }
};

// Get analytics data for dashboard
export const getAnalytics = async (req, res) => {
  try {
    const { dateFilter } = req.query;
    const orders = await getFilteredOrders(dateFilter);

    const analytics = {
      totalOrders: orders.length,
      totalRevenue: orders.reduce((sum, order) => sum + order.totalAmount, 0),
      averageOrderValue: orders.length > 0 ? orders.reduce((sum, order) => sum + order.totalAmount, 0) / orders.length : 0,
      completedOrders: orders.filter((o) => o.status === 'Completed').length,
      pendingOrders: orders.filter((o) => o.status === 'Pending').length,
      inProgressOrders: orders.filter((o) => o.status === 'In progress').length,
      orders,
    };

    res.json(analytics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper function to filter orders by date
async function getFilteredOrders(dateFilter) {
  // Return all orders for 'all' or undefined filter
  if (!dateFilter || dateFilter === 'all') {
    return await Order.find();
  }

  const now = new Date();
  let startDate;

  switch (dateFilter) {
    case 'today':
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case 'last7':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case 'last30':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case 'last90':
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      break;
    default:
      return await Order.find();
  }

  return await Order.find({ createdAt: { $gte: startDate } });
}