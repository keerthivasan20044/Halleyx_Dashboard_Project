import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, MoreVertical, Edit, Trash2, ArrowLeft, LayoutDashboard, Table, Eye } from 'lucide-react';
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
      <div className="flex items-center justify-center min-h-screen md:h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen md:h-full md:flex md:flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-6 md:flex-shrink-0">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col gap-3 sm:gap-4 mb-3 sm:mb-4 lg:mb-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                onClick={() => navigate('/')}
                className="hidden lg:flex items-center justify-center w-9 h-9 xl:w-10 xl:h-10 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-150"
              >
                <ArrowLeft size={18} className="xl:w-5 xl:h-5" />
              </button>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1 truncate">Customer Orders</h1>
                <p className="text-xs sm:text-sm lg:text-base text-gray-600 hidden sm:block">View and manage customer orders and details</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
              <div className="flex-1 space-y-3">
                <DateFilter value={dateFilter} onChange={setDateFilter} />
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} className="sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                  <input
                    type="text"
                    placeholder="Search orders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm transition-colors duration-150"
                  />
                </div>
              </div>
              <button
                onClick={handleCreate}
                className="bg-primary text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg font-medium hover:bg-primary/90 flex items-center justify-center gap-2 text-sm transition-all duration-150 shadow-sm hover:shadow-md w-full sm:w-auto flex-shrink-0"
              >
                <Plus size={16} className="sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                <span>New Order</span>
              </button>
            </div>
          </div>
          
          <div className="flex border-b border-gray-200 -mx-3 sm:-mx-4 lg:-mx-6 px-3 sm:px-4 lg:px-6">
            <button 
              onClick={() => navigate('/')}
              className="flex-1 sm:flex-none pb-2 sm:pb-3 border-b-2 border-transparent text-gray-500 hover:text-gray-700 font-medium flex items-center justify-center sm:justify-start gap-1 sm:gap-2 text-xs sm:text-sm lg:text-base min-w-0"
            >
              <LayoutDashboard size={16} className="sm:w-4 sm:h-4 lg:w-5 lg:h-5 flex-shrink-0" />
              <span className="truncate">Dashboard</span>
            </button>
            <button className="flex-1 sm:flex-none pb-2 sm:pb-3 border-b-2 border-primary text-primary font-medium flex items-center justify-center sm:justify-start gap-1 sm:gap-2 text-xs sm:text-sm lg:text-base ml-4 sm:ml-6 lg:ml-8 min-w-0">
              <Table size={16} className="sm:w-4 sm:h-4 lg:w-5 lg:h-5 flex-shrink-0" />
              <span className="truncate">Table</span>
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="pb-4 md:pb-6 md:flex-1 md:overflow-hidden">
        <div className="p-4 md:p-6 md:h-full">
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 min-h-96 md:h-full flex flex-col items-center justify-center p-8">
              <div className="text-center text-gray-500">
                <div className="text-6xl mb-4">📦</div>
                <p className="text-lg font-medium mb-2">No orders found</p>
                <p className="text-sm mb-6">Start by creating your first order</p>
                <button
                  onClick={handleCreate}
                  className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 flex items-center gap-2 mx-auto"
                >
                  <Plus size={18} />
                  New Order
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Mobile Card View */}
              <div className="lg:hidden space-y-3 sm:space-y-4">
                {filteredOrders.map((order) => (
                  <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-100 p-3 sm:p-4 relative">
                    <div className="flex justify-between items-start mb-2 sm:mb-3">
                      <div className="flex items-center gap-1 sm:gap-2 min-w-0 flex-1">
                        <span className="text-xs sm:text-sm font-semibold text-gray-900 truncate">
                          #{order.orderId || order.id.slice(0, 8)}
                        </span>
                        <span className={`inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${
                          order.status === 'Completed' ? 'bg-green-100 text-green-800' :
                          order.status === 'In progress' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {order.status === 'Completed' && '🟢'}
                          {order.status === 'In progress' && '🟡'}
                          {order.status === 'Cancelled' && '🔴'}
                          <span className="hidden sm:inline ml-1">{order.status}</span>
                        </span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setContextMenu(contextMenu === order.id ? null : order.id);
                        }}
                        className="p-1 text-gray-400 hover:text-gray-600 rounded flex-shrink-0"
                      >
                        <MoreVertical size={14} className="sm:w-4 sm:h-4" />
                      </button>
                    </div>
                    
                    <div className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4">
                      <div className="min-w-0">
                        <span className="text-xs sm:text-sm font-medium text-gray-600">Customer: </span>
                        <span className="text-xs sm:text-sm text-gray-900 break-words">
                          {order.customerName || `${order.firstName} ${order.lastName}`}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs sm:text-sm font-medium text-gray-600">Product: </span>
                        <span className="text-xs sm:text-sm text-gray-900 break-words">
                          {order.product?.length > (window.innerWidth < 640 ? 25 : 30) ? `${order.product.substring(0, window.innerWidth < 640 ? 25 : 30)}...` : order.product || 'No product'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-xs sm:text-sm font-medium text-gray-600">Qty: </span>
                          <span className="text-xs sm:text-sm text-gray-900">{order.quantity}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs sm:text-sm font-medium text-gray-600">Total: </span>
                          <span className="text-xs sm:text-sm font-semibold text-gray-900">
                            ${parseFloat(order.total).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-1.5 sm:gap-2">
                      <button
                        onClick={() => handleEdit(order)}
                        className="flex-1 bg-gray-100 text-gray-700 px-2 sm:px-3 py-1.5 sm:py-2 rounded-md sm:rounded-lg text-xs sm:text-sm font-medium hover:bg-gray-200 flex items-center justify-center gap-1 sm:gap-2 transition-colors"
                      >
                        <Eye size={12} className="sm:w-3.5 sm:h-3.5" />
                        <span className="hidden sm:inline">View</span>
                      </button>
                      <button
                        onClick={() => handleEdit(order)}
                        className="flex-1 bg-blue-100 text-blue-700 px-2 sm:px-3 py-1.5 sm:py-2 rounded-md sm:rounded-lg text-xs sm:text-sm font-medium hover:bg-blue-200 flex items-center justify-center gap-1 sm:gap-2 transition-colors"
                      >
                        <Edit size={12} className="sm:w-3.5 sm:h-3.5" />
                        <span className="hidden sm:inline">Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(order)}
                        className="flex-1 bg-red-100 text-red-700 px-2 sm:px-3 py-1.5 sm:py-2 rounded-md sm:rounded-lg text-xs sm:text-sm font-medium hover:bg-red-200 flex items-center justify-center gap-1 sm:gap-2 transition-colors"
                      >
                        <Trash2 size={12} className="sm:w-3.5 sm:h-3.5" />
                        <span className="hidden sm:inline">Delete</span>
                      </button>
                    </div>
                    
                    {contextMenu === order.id && (
                      <div className="absolute right-2 top-12 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50 py-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(order);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                        >
                          <Eye size={14} className="text-gray-400" />
                          View Details
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(order);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                        >
                          <Edit size={14} className="text-gray-400" />
                          Edit Order
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(order);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3"
                        >
                          <Trash2 size={14} className="text-red-500" />
                          Delete Order
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Desktop Table View */}
              <div className="hidden md:block bg-white rounded-lg shadow-sm border border-gray-100 h-full">
                <div className="h-full overflow-auto">
                  <table className="w-full table-fixed">
                    <thead className="bg-gray-50 sticky top-0 z-10">
                      <tr className="border-b border-gray-200">
                        <th className="w-24 px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Order ID</th>
                        <th className="w-40 px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer</th>
                        <th className="w-48 px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                        <th className="w-40 px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Product</th>
                        <th className="w-20 px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Qty</th>
                        <th className="w-24 px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Unit Price</th>
                        <th className="w-24 px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Total</th>
                        <th className="w-28 px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                        <th className="w-32 px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Created By</th>
                        <th className="w-20 px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {filteredOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50 transition-colors duration-150">
                          <td className="px-6 py-4 text-sm font-medium text-gray-900 truncate">
                            #{order.orderId || order.id.slice(0, 8)}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 truncate">
                            {order.customerName || `${order.firstName} ${order.lastName}`}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 truncate">
                            {order.email}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 truncate">
                            {order.product}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 text-center">
                            {order.quantity}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 text-right font-medium">
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
                          <td className="px-6 py-4 text-sm text-gray-500 truncate">
                            {order.createdBy}
                          </td>
                          <td className="px-6 py-4 text-center">
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
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
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