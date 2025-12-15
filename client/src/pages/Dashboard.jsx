import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { Settings, LayoutDashboard, Trash2, Table } from 'lucide-react';
import DateFilter from '../components/DateFilter';
import { ordersAPI } from '../services/api';
import { chartPersistence } from '../services/chartPersistence';
import KPIWidget from '../widgets/KPIWidget';
import BarChartWidget from '../widgets/BarChartWidget';
import LineChartWidget from '../widgets/LineChartWidget';
import AreaChartWidget from '../widgets/AreaChartWidget';
import ScatterChartWidget from '../widgets/ScatterChartWidget';
import PieChartWidget from '../widgets/PieChartWidget';
import TableWidget from '../widgets/TableWidget';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

const widgetComponents = {
  kpi: KPIWidget,
  bar: BarChartWidget,
  line: LineChartWidget,
  area: AreaChartWidget,
  scatter: ScatterChartWidget,
  pie: PieChartWidget,
  table: TableWidget,
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [dateFilter, setDateFilter] = useState('all');
  const [widgets, setWidgets] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingWidget, setDeletingWidget] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [dashboardData, ordersData] = await Promise.all([
        chartPersistence.loadCharts(),
        ordersAPI.getAll(),
      ]);
      setWidgets(dashboardData.widgets || []);
      setDateFilter(dashboardData.dateFilter || 'all');
      setOrders(ordersData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateFilterChange = async (newFilter) => {
    setDateFilter(newFilter);
    try {
      await chartPersistence.saveCharts(widgets, newFilter);
    } catch (error) {
      console.error('Error saving date filter:', error);
    }
  };

  const handleDeleteWidget = async (widgetId) => {
    if (deletingWidget) return;
    
    setDeletingWidget(widgetId);
    try {
      await chartPersistence.deleteChart(widgetId);
      setWidgets(prev => prev.filter(w => w.id !== widgetId));
    } catch (error) {
      console.error('Error deleting widget:', error);
    } finally {
      setDeletingWidget(null);
    }
  };

  const filterOrdersByDate = (orders) => {
    // Return all orders for 'all' filter
    if (dateFilter === 'all') {
      return orders;
    }

    const now = new Date();
    return orders.filter(order => {
      const orderDate = new Date(order.orderDate || order.createdAt);
      switch (dateFilter) {
        case 'today':
          return orderDate.toDateString() === now.toDateString();
        case 'last7':
          return (now - orderDate) / (1000 * 60 * 60 * 24) <= 7;
        case 'last30':
          return (now - orderDate) / (1000 * 60 * 60 * 24) <= 30;
        case 'last90':
          return (now - orderDate) / (1000 * 60 * 60 * 24) <= 90;
        default:
          return true;
      }
    });
  };

  const filteredOrders = filterOrdersByDate(orders);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (widgets.length === 0) {
    return (
      <div className="flex flex-col h-full bg-gray-50">
        {/* Header Section */}
        <div className="bg-white border-b border-gray-200 px-6 py-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Customer Orders</h1>
            <p className="text-gray-600 mb-6">View and manage customer orders and details</p>
            
            {/* Tabs */}
            <div className="flex space-x-8">
              <button className="pb-3 border-b-2 border-primary text-primary font-medium flex items-center gap-2">
                <LayoutDashboard size={18} />
                Dashboard
              </button>
              <button 
                onClick={() => navigate('/orders')}
                className="pb-3 border-b-2 border-transparent text-gray-500 hover:text-gray-700 font-medium flex items-center gap-2"
              >
                <Table size={18} />
                Table
              </button>
            </div>
          </div>
        </div>
        
        {/* Empty State Content */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto flex items-center justify-center">
                <LayoutDashboard size={32} className="text-gray-400" />
              </div>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Dashboard Not Configured</h2>
            <p className="text-gray-500 mb-8">Configure your dashboard to start viewing analytics</p>
            <button
              onClick={() => navigate('/builder')}
              className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Configure dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const layouts = {
    lg: widgets.map(w => ({ i: w.id, x: w.x, y: w.y, w: w.w, h: w.h })),
    md: widgets.map(w => ({ i: w.id, x: w.x, y: w.y, w: Math.min(w.w, 8), h: w.h })),
    sm: widgets.map(w => ({ i: w.id, x: 0, y: w.y, w: 4, h: w.h })),
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Customer Orders</h1>
              <p className="text-gray-600">View and manage customer orders and details</p>
            </div>
            <div className="flex items-center gap-2">
              <DateFilter value={dateFilter} onChange={handleDateFilterChange} />
              <button
                onClick={() => navigate('/builder')}
                className="bg-primary text-white px-3 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors inline-flex items-center gap-2 text-sm"
              >
                <Settings size={16} />
                <span className="hidden sm:inline">Configure</span>
              </button>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="flex space-x-8">
            <button className="pb-3 border-b-2 border-primary text-primary font-medium flex items-center gap-2">
              <LayoutDashboard size={18} />
              Dashboard
            </button>
            <button 
              onClick={() => navigate('/orders')}
              className="pb-3 border-b-2 border-transparent text-gray-500 hover:text-gray-700 font-medium flex items-center gap-2"
            >
              <Table size={18} />
              Table
            </button>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-6">
        <ResponsiveGridLayout
          className="layout"
          layouts={layouts}
          breakpoints={{ lg: 1024, md: 768, sm: 0 }}
          cols={{ lg: 12, md: 8, sm: 4 }}
          rowHeight={80}
          isDraggable={false}
          isResizable={false}
          margin={[16, 16]}
        >
          {widgets.map(widget => {
            const WidgetComponent = widgetComponents[widget.type];
            return (
              <div key={widget.id} className="widget-container bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden transition-shadow hover:shadow-md group relative">
                <button
                  onClick={() => handleDeleteWidget(widget.id)}
                  disabled={deletingWidget === widget.id}
                  className="widget-actions absolute top-2 right-2 z-10 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-md disabled:opacity-50"
                  title="Delete chart"
                >
                  {deletingWidget === widget.id ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Trash2 size={14} />
                  )}
                </button>
                <div className="p-4 h-full">
                  {WidgetComponent && <WidgetComponent config={widget.config} data={filteredOrders} />}
                </div>
              </div>
            );
          })}
        </ResponsiveGridLayout>
      </div>
    </div>
  );
};

export default Dashboard;