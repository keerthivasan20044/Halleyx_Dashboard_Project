import { useState, useEffect, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { Settings, Trash2, Save, X, ArrowLeft, Menu } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import ConfirmModal from '../components/ConfirmModal';
import DateFilter from '../components/DateFilter';
import { ordersAPI } from '../services/api';
import { chartPersistence } from '../services/chartPersistence';
import WidgetLibrary from '../components/WidgetLibrary';
import WidgetConfig from '../components/WidgetConfig';
import KPIWidget from '../widgets/KPIWidget';
import BarChartWidget from '../widgets/BarChartWidget';
import LineChartWidget from '../widgets/LineChartWidget';
import AreaChartWidget from '../widgets/AreaChartWidget';
import ScatterChartWidget from '../widgets/ScatterChartWidget';
import PieChartWidget from '../widgets/PieChartWidget';
import TableWidget from '../widgets/TableWidget';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import '../styles/builder.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

const widgetComponents = {
  kpi: memo(KPIWidget),
  bar: memo(BarChartWidget),
  line: memo(LineChartWidget),
  area: memo(AreaChartWidget),
  scatter: memo(ScatterChartWidget),
  pie: memo(PieChartWidget),
  table: memo(TableWidget),
};

const Builder = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [widgets, setWidgets] = useState([]);
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedWidget, setSelectedWidget] = useState(null);
  const [orders, setOrders] = useState([]);
  const [hoveredWidget, setHoveredWidget] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [dragTimeout, setDragTimeout] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
      if (dragTimeout) clearTimeout(dragTimeout);
    };
  }, [dragTimeout]);

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
    }
  };

  const getDefaultConfig = (type) => {
    const titles = {
      kpi: 'Total Revenue',
      bar: 'Sales by Product',
      line: 'Revenue Trend',
      area: 'Order Volume',
      scatter: 'Price vs Quantity',
      pie: 'Orders by Status',
      table: 'Order Details',
    };
    const base = { title: titles[type] || 'Untitled' };
    
    switch (type) {
      case 'kpi':
        return { ...base, metric: 'total', aggregation: 'sum', format: 'number', decimals: 0 };
      case 'bar':
      case 'line':
      case 'area':
      case 'scatter':
        return { ...base, xField: 'product', yField: 'total', color: '#10b981', showLabel: false };
      case 'pie':
        return { ...base, dataField: 'status', showLegend: false };
      case 'table':
        return { ...base, columns: ['customerId', 'customerName', 'product', 'quantity', 'total', 'status'], sortBy: 'orderDate', pageSize: 5, fontSize: 14, headerBg: '#54bd95', applyFilter: false };
      default:
        return base;
    }
  };

  const handleAddWidget = (type) => {
    const sizeMap = {
      kpi: { w: 2, h: 2 },
      bar: { w: 5, h: 5 },
      line: { w: 5, h: 5 },
      area: { w: 5, h: 5 },
      scatter: { w: 5, h: 5 },
      pie: { w: 4, h: 4 },
      table: { w: 4, h: 4 },
    };
    
    const size = sizeMap[type] || { w: 4, h: 3 };
    
    const newWidget = {
      id: uuidv4(),
      type,
      x: 0,
      y: Infinity,
      w: size.w,
      h: size.h,
      config: getDefaultConfig(type),
    };
    setWidgets([...widgets, newWidget]);
    setSelectedWidget(newWidget);
    // Close sidebar on mobile/tablet after adding widget
    setSidebarOpen(false);
  };

  const handleLayoutChange = (layout) => {
    setWidgets(widgets.map(widget => {
      const layoutItem = layout.find(l => l.i === widget.id);
      return layoutItem ? { ...widget, x: layoutItem.x, y: layoutItem.y, w: layoutItem.w, h: layoutItem.h } : widget;
    }));
  };

  const handleDeleteWidget = (id) => {
    setDeleteConfirm(id);
  };

  const confirmDelete = async () => {
    try {
      await chartPersistence.deleteChart(deleteConfirm);
      const updatedWidgets = widgets.filter(w => w.id !== deleteConfirm);
      setWidgets(updatedWidgets);
      if (selectedWidget?.id === deleteConfirm) setSelectedWidget(null);
      setDeleteConfirm(null);
      showToast('Widget deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting widget:', error);
      showToast('Failed to delete widget', 'error');
    }
  };

  const handleConfigChange = (config, sizeUpdates = {}) => {
    const updatedWidget = { 
      ...selectedWidget, 
      config,
      ...sizeUpdates
    };
    setWidgets(widgets.map(w => w.id === selectedWidget.id ? updatedWidget : w));
    setSelectedWidget(updatedWidget);
  };

  const handleDateFilterChange = async (newFilter) => {
    setDateFilter(newFilter);
    try {
      await chartPersistence.saveCharts(widgets, newFilter);
    } catch (error) {
      console.error('Error saving date filter:', error);
    }
  };

  const filterOrdersByDate = (orders) => {
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

  const handleSave = async () => {
    try {
      await chartPersistence.saveCharts(widgets, dateFilter);
      showToast('Dashboard saved successfully', 'success');
      navigate('/');
    } catch (error) {
      showToast('Failed to save dashboard', 'error');
      console.error('Error saving dashboard:', error);
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  const filteredOrders = filterOrdersByDate(orders);

  const layouts = {
    lg: widgets.map(w => ({ i: w.id, x: w.x, y: w.y, w: w.w, h: w.h, minW: 1, minH: 1 })),
    md: widgets.map(w => ({ i: w.id, x: w.x % 8, y: w.y, w: Math.min(w.w, 8), h: w.h, minW: 1, minH: 1 })),
    sm: widgets.map(w => ({ i: w.id, x: 0, y: w.y, w: Math.min(w.w, 4), h: w.h, minW: 1, minH: 1 })),
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-white border-b border-gray-200 px-4 md:px-8 py-4 flex-shrink-0">
        <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Back to dashboard"
            >
              <ArrowLeft size={20} className="text-gray-700" />
            </button>
            <div>
              <h2 className="text-lg md:text-xl font-bold text-gray-900">Configure Dashboard</h2>
              <p className="text-xs md:text-sm text-gray-500">Configure your dashboard to start viewing analytics</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <DateFilter value={dateFilter} onChange={handleDateFilterChange} />
            <div className="flex gap-2 md:gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Menu size={20} />
              </button>
              <button
                onClick={() => navigate('/')}
                className="px-3 md:px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm md:text-base"
              >
                <X size={18} />
                <span className="hidden sm:inline">Cancel</span>
              </button>
              <button
                onClick={handleSave}
                className="px-3 md:px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center gap-2 text-sm md:text-base shadow-sm"
              >
                <Save size={18} />
                <span className="hidden sm:inline">Save</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar - Always visible */}
        <div className="hidden lg:block">
          <WidgetLibrary onAddWidget={handleAddWidget} />
        </div>

        {/* Mobile/Tablet Sidebar Overlay */}
        {sidebarOpen && (
          <>
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" 
              onClick={() => setSidebarOpen(false)} 
            />
            <div className="fixed top-0 left-0 h-full w-80 max-w-[90vw] bg-white z-50 lg:hidden transform transition-transform duration-300 ease-in-out">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Widget Library</h3>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Close sidebar"
                >
                  <X size={20} className="text-gray-600" />
                </button>
              </div>
              <div className="h-full pb-20 overflow-y-auto">
                <WidgetLibrary onAddWidget={handleAddWidget} />
              </div>
            </div>
          </>
        )}

        {/* Canvas with Grid Pattern */}
        <div className="flex-1 p-4 md:p-6 overflow-y-auto builder-grid bg-gray-50">
          {widgets.length === 0 ? (
            <div className="min-h-[400px] flex items-center justify-center">
              <div className="text-center text-gray-500">
                <p className="text-base md:text-lg font-medium">Add widgets from the library to get started</p>
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden mt-4 px-4 py-2 bg-primary text-white rounded-lg"
                >
                  Open Widget Library
                </button>
              </div>
            </div>
          ) : (
            <ResponsiveGridLayout
              className="layout"
              layouts={layouts}
              breakpoints={{ lg: 1024, md: 768, sm: 0 }}
              cols={{ lg: 12, md: 8, sm: 4 }}
              rowHeight={isMobile ? 60 : 80}
              onLayoutChange={handleLayoutChange}
              draggableHandle=".drag-handle"
              margin={isMobile ? [8, 12] : [16, 16]}
              compactType="vertical"
              isDraggable={true}
              isResizable={!isMobile}
              useCSSTransforms={true}
              preventCollision={false}
              autoSize={true}
              transformScale={1}
              allowOverlap={false}
              onDragStart={() => {
                setIsDragging(true);
                if (isMobile) document.body.style.overflow = 'hidden';
              }}
              onDragStop={() => {
                setIsDragging(false);
                document.body.style.overflow = '';
              }}
            >
              {widgets.map(widget => {
                const WidgetComponent = widgetComponents[widget.type];
                const isHovered = hoveredWidget === widget.id;
                return (
                  <div
                    key={widget.id}
                    className="widget-container bg-white rounded-lg shadow-sm border border-gray-200 relative group transition-all hover:shadow-md touch-manipulation"
                    onMouseEnter={() => !isMobile && setHoveredWidget(widget.id)}
                    onMouseLeave={() => !isMobile && setHoveredWidget(null)}
                    onTouchStart={(e) => {
                      setHoveredWidget(widget.id);
                      if (e.target.classList.contains('drag-handle')) {
                        const timeout = setTimeout(() => {
                          document.body.style.overflow = 'hidden';
                          document.body.style.touchAction = 'none';
                        }, 350);
                        setDragTimeout(timeout);
                      }
                    }}
                    onTouchEnd={() => {
                      if (dragTimeout) {
                        clearTimeout(dragTimeout);
                        setDragTimeout(null);
                      }
                      document.body.style.overflow = '';
                      document.body.style.touchAction = '';
                      setTimeout(() => setHoveredWidget(null), 1500);
                    }}
                  >
                    {/* Drag Handle - More prominent on mobile */}
                    <div 
                      className="drag-handle absolute inset-0 cursor-move select-none" 
                      style={{ 
                        touchAction: isMobile ? 'none' : 'manipulation',
                        WebkitTouchCallout: 'none',
                        WebkitUserSelect: 'none'
                      }} 
                    />
                    
                    {/* Mobile Drag Indicator */}
                    <div className="absolute top-2 left-2 md:hidden pointer-events-none z-20">
                      <div className="w-6 h-1 bg-gray-400 rounded-full mb-1"></div>
                      <div className="w-4 h-1 bg-gray-400 rounded-full mb-1"></div>
                      <div className="w-5 h-1 bg-gray-400 rounded-full"></div>
                    </div>
                    
                    <div className="p-4 pointer-events-none relative z-10 h-full overflow-hidden">
                      {WidgetComponent && <WidgetComponent config={widget.config} data={filteredOrders} />}
                    </div>
                    
                    {/* Widget Actions - Always visible on mobile, hover on desktop */}
                    <div className={`widget-actions absolute top-2 right-2 flex gap-1.5 z-20 transition-opacity duration-200 ${
                      isHovered || isMobile ? 'opacity-100' : 'opacity-0'
                    }`}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedWidget(widget);
                        }}
                        className="p-2 md:p-1.5 bg-white rounded-lg shadow-lg hover:bg-gray-50 active:bg-gray-100 pointer-events-auto transition-colors border border-gray-200 touch-manipulation"
                        title="Settings"
                      >
                        <Settings size={16} className="text-gray-600 md:w-3.5 md:h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteWidget(widget.id);
                        }}
                        className="p-2 md:p-1.5 bg-white rounded-lg shadow-lg hover:bg-red-50 active:bg-red-100 pointer-events-auto transition-colors border border-gray-200 touch-manipulation"
                        title="Delete"
                      >
                        <Trash2 size={16} className="text-red-600 md:w-3.5 md:h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </ResponsiveGridLayout>
          )}
        </div>

        {/* Configuration Panel - Desktop */}
        {selectedWidget && (
          <div className="hidden md:block">
            <WidgetConfig
              widget={selectedWidget}
              onConfigChange={handleConfigChange}
              onClose={() => setSelectedWidget(null)}
            />
          </div>
        )}
      </div>

      {/* Configuration Panel - Mobile Overlay */}
      {selectedWidget && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end animate-fadeIn">
          <div className="bg-white w-full max-h-[80vh] rounded-t-2xl overflow-y-auto animate-slideUp">
            <WidgetConfig
              widget={selectedWidget}
              onConfigChange={handleConfigChange}
              onClose={() => setSelectedWidget(null)}
            />
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={deleteConfirm !== null}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={confirmDelete}
        title="Delete Widget"
        message="Are you sure you want to delete this widget?"
      />
    </div>
  );
};

export default Builder;