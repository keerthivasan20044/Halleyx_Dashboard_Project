import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, MoreVertical, Edit, Trash2, ArrowLeft, LayoutDashboard, Table } from 'lucide-react';
import { ordersAPI } from '../services/api';
import { useToast } from '../contexts/ToastContext';
import OrderModal from '../components/OrderModal';
import ConfirmModal from '../components/ConfirmModal';
import DateFilter from '../components/DateFilter';

const Orders = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);
  const [swipedRow, setSwipedRow] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleClickOutside = () => {
      setContextMenu(null);
      setSwipedRow(null);
    };
    if (contextMenu || swipedRow) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [contextMenu, swipedRow]);

  useEffect(() => {
    loadOrders();
  }, []);

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

  useEffect(() => {
    const dateFiltered = filterOrdersByDate(orders);
    const searchFiltered = dateFiltered.filter(order =>
      Object.values(order).some(val =>
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredOrders(searchFiltered);
  }, [searchTerm, orders, dateFilter]);

  const loadOrders = async () => {
    try {
      const data = await ordersAPI.getAll();
      setOrders(data);
      setFilteredOrders(data);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingOrder(null);
    setShowModal(true);
  };

  const handleEdit = (order) => {
    setEditingOrder(order);
    setShowModal(true);
    setContextMenu(null);
    setSwipedRow(null);
  };

  const handleDelete = (order) => {
    setContextMenu(null);
    setSwipedRow(null);
    setOrderToDelete(order);
    setShowConfirmModal(true);
  };

  const handleSwipe = (orderId, deltaX) => {
    if (deltaX < -50) {
      setSwipedRow(orderId);
    } else if (deltaX > 50) {
      setSwipedRow(null);
    }
  };

  const confirmDelete = async () => {
    if (orderToDelete) {
      try {
        await ordersAPI.delete(orderToDelete.id);
        showToast('Order deleted successfully', 'success');
        await loadOrders();
      } catch (error) {
        showToast('Failed to delete order', 'error');
        console.error('Error deleting order:', error);
      }
    }
    setShowConfirmModal(false);
    setOrderToDelete(null);
  };

  const handleSave = async (orderData) => {
    try {
      if (editingOrder) {
        await ordersAPI.update(editingOrder.id, orderData);
        showToast('Order updated successfully', 'success');
      } else {
        await ordersAPI.create(orderData);
        showToast('Order created successfully', 'success');
      }
      setShowModal(false);
      setEditingOrder(null);
      await loadOrders();
    } catch (error) {
      showToast('Failed to save order', 'error');
      console.error('Error saving order:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-6 flex-shrink-0">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4 mb-6">
            <div className="flex items-center gap-4">
              {/* Back Arrow - Only visible on desktop */}
              <button
                onClick={() => navigate('/')}
                className="hidden lg:flex items-center justify-center w-10 h-10 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-150"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">Customer Orders</h1>
                <p className="text-gray-600">View and manage customer orders and details</p>
              </div>
            </div>
            <div className="flex flex-col lg:flex-row gap-3">
              <DateFilter value={dateFilter} onChange={setDateFilter} />
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search orders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full sm:w-80 pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm transition-colors duration-150"
                  />
                </div>
                <button
                  onClick={handleCreate}
                  className="bg-primary text-white px-5 py-2.5 rounded-lg font-medium hover:bg-primary/90 flex items-center justify-center gap-2 text-sm transition-all duration-150 shadow-sm hover:shadow-md"
                >
                  <Plus size={18} />
                  <span>New Order</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="flex space-x-8">
            <button 
              onClick={() => navigate('/')}
              className="pb-3 border-b-2 border-transparent text-gray-500 hover:text-gray-700 font-medium flex items-center gap-2"
            >
              <LayoutDashboard size={18} />
              Dashboard
            </button>
            <button className="pb-3 border-b-2 border-primary text-primary font-medium flex items-center gap-2">
              <Table size={18} />
              Table
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-hidden p-4 md:p-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 h-full flex flex-col">
          {filteredOrders.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <p className="text-lg font-medium">No orders found</p>
                <p className="text-sm mt-1">Try adjusting your search criteria</p>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-hidden">
              <div className="h-full overflow-auto">
                <table className="w-full table-fixed">
                  <thead className="bg-gray-50 sticky top-0 z-10">
                    <tr className="border-b border-gray-200">
                      <th className="w-24 px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Order ID</th>
                      <th className="w-40 px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer</th>
                      <th className="w-48 px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider md:table-cell hidden">Email</th>
                      <th className="w-40 px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Product</th>
                      <th className="w-20 px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider md:table-cell hidden">Qty</th>
                      <th className="w-24 px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider md:table-cell hidden">Unit Price</th>
                      <th className="w-24 px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Total</th>
                      <th className="w-28 px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                      <th className="w-32 px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider md:table-cell hidden">Created By</th>
                      <th className="w-20 px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider md:table-cell hidden">Actions</th>

                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {filteredOrders.map((order) => {
                      const SwipeableRow = ({ children }) => {
                        const [startX, setStartX] = useState(0);
                        const [currentX, setCurrentX] = useState(0);
                        const [isDragging, setIsDragging] = useState(false);
                        
                        const handleTouchStart = (e) => {
                          if (window.innerWidth >= 768) return;
                          setStartX(e.touches[0].clientX);
                          setIsDragging(true);
                        };
                        
                        const handleTouchMove = (e) => {
                          if (!isDragging || window.innerWidth >= 768) return;
                          const x = e.touches[0].clientX;
                          setCurrentX(x - startX);
                        };
                        
                        const handleTouchEnd = () => {
                          if (!isDragging || window.innerWidth >= 768) return;
                          handleSwipe(order.id, currentX);
                          setCurrentX(0);
                          setIsDragging(false);
                        };
                        
                        return (
                          <div className="relative overflow-hidden md:contents">
                            <div 
                              className="md:contents"
                              style={{
                                transform: window.innerWidth < 768 ? `translateX(${swipedRow === order.id ? -120 : currentX}px)` : 'none',
                                transition: isDragging ? 'none' : 'transform 0.3s ease'
                              }}
                              onTouchStart={handleTouchStart}
                              onTouchMove={handleTouchMove}
                              onTouchEnd={handleTouchEnd}
                            >
                              {children}
                            </div>
                            {swipedRow === order.id && (
                              <div className="md:hidden absolute right-0 top-0 h-full flex">
                                <button
                                  onClick={() => handleEdit(order)}
                                  className="w-14 h-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 transition-colors"
                                >
                                  <Edit size={18} />
                                </button>
                                <button
                                  onClick={() => handleDelete(order)}
                                  className="w-14 h-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      };
                      
                      return (
                        <SwipeableRow key={order.id}>
                          <tr className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 truncate">
                          #{order.orderId || order.id.slice(0, 8)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 truncate">
                          {order.customerName || `${order.firstName} ${order.lastName}`}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 truncate md:table-cell hidden">
                          {order.email}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 truncate">
                          {order.product}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 text-center md:table-cell hidden">
                          {order.quantity}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 text-right font-medium md:table-cell hidden">
                          ${parseFloat(order.unitPrice).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 text-right font-semibold">
                          ${parseFloat(order.total).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            order.status === 'Completed' ? 'bg-green-100 text-green-800' :
                            order.status === 'In progress' ? 'bg-blue-100 text-blue-800' :
                            'bg-orange-100 text-orange-800'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 truncate md:table-cell hidden">
                          {order.createdBy}
                        </td>
                        {/* Desktop/Tablet Actions */}
                        <td className="px-6 py-4 text-center md:table-cell hidden">
                          <div className="relative inline-block">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setContextMenu(contextMenu === order.id ? null : order.id);
                              }}
                              className="inline-flex items-center justify-center w-8 h-8 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors duration-150"
                            >
                              <MoreVertical size={16} />
                            </button>
                            {contextMenu === order.id && (
                              <div className="absolute right-0 top-10 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-50 py-1">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEdit(order);
                                  }}
                                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors duration-150"
                                >
                                  <Edit size={14} className="text-gray-400" />
                                  Edit Order
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(order);
                                  }}
                                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors duration-150"
                                >
                                  <Trash2 size={14} className="text-red-500" />
                                  Delete Order
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                          </tr>
                        </SwipeableRow>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>



      {showModal && (
        <OrderModal
          order={editingOrder}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
        />
      )}

      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={confirmDelete}
        title="Delete Order"
        message={`Are you sure you want to delete order ${orderToDelete?.orderId || orderToDelete?.id?.slice(0, 8)}? This action cannot be undone.`}
      />
    </div>
  );
};

export default Orders;
