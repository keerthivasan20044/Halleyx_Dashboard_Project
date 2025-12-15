import { X } from 'lucide-react';
import { useState, useCallback } from 'react';

const WidgetConfig = ({ widget, onConfigChange, onClose }) => {
  const [errors, setErrors] = useState({});

  const updateConfig = useCallback((key, value) => {
    onConfigChange({ ...widget.config, [key]: value });
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: null }));
    }
  }, [widget.config, onConfigChange, errors]);

  const updateSize = useCallback((dimension, value) => {
    const numValue = parseInt(value) || 1;
    const sizeUpdate = {};
    if (dimension === 'w') {
      sizeUpdate.w = Math.max(1, Math.min(12, numValue));
    } else if (dimension === 'h') {
      sizeUpdate.h = Math.max(1, Math.min(10, numValue));
    }
    onConfigChange(widget.config, sizeUpdate);
  }, [widget.config, onConfigChange]);

  const validateTitle = () => {
    if (!widget.config.title?.trim()) {
      setErrors(prev => ({ ...prev, title: 'Please fill the field' }));
      return false;
    }
    return true;
  };

  const renderKPIConfig = () => {
    const numericFields = ['quantity', 'unitPrice', 'total'];
    const selectedMetric = widget.config.metric || 'total';
    const isNumeric = numericFields.includes(selectedMetric);
    
    return (
      <>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Metric</label>
          <select
            value={selectedMetric}
            onChange={(e) => {
              updateConfig('metric', e.target.value);
              const newIsNumeric = numericFields.includes(e.target.value);
              if (!newIsNumeric && widget.config.aggregation !== 'count') {
                updateConfig('aggregation', 'count');
              }
            }}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
          >
            <option value="total">Total Amount</option>
            <option value="unitPrice">Unit Price</option>
            <option value="quantity">Quantity</option>
            <option value="customerId">Customer ID</option>
            <option value="customerName">Customer Name</option>
            <option value="email">Email ID</option>
            <option value="address">Address</option>
            <option value="orderDate">Order Date</option>
            <option value="product">Product</option>
            <option value="createdBy">Created By</option>
            <option value="status">Status</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Aggregation</label>
          <select
            value={widget.config.aggregation || 'sum'}
            onChange={(e) => updateConfig('aggregation', e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
          >
            <option value="sum" disabled={!isNumeric}>Sum</option>
            <option value="average" disabled={!isNumeric}>Average</option>
            <option value="count">Count</option>
          </select>
          {!isNumeric && (
            <p className="text-xs text-gray-500 mt-1">Only Count available for non-numeric fields</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Data Format</label>
          <select
            value={widget.config.format || 'number'}
            onChange={(e) => updateConfig('format', e.target.value)}
            className={`w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors ${
              !isNumeric ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : ''
            }`}
            disabled={!isNumeric}
          >
            <option value="number">Number</option>
            <option value="currency">Currency</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Decimal Precision</label>
          <input
            type="number"
            min="0"
            max="4"
            value={widget.config.decimals ?? 0}
            onChange={(e) => updateConfig('decimals', parseInt(e.target.value) || 0)}
            className={`w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors ${
              !isNumeric ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : ''
            }`}
            disabled={!isNumeric}
          />
        </div>
      </>
    );
  };

  const renderChartConfig = () => (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Choose X-Axis Data</label>
        <select
          value={widget.config.xField || 'product'}
          onChange={(e) => updateConfig('xField', e.target.value)}
          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
        >
          <option value="product">Product</option>
          <option value="quantity">Quantity</option>
          <option value="unitPrice">Unit Price</option>
          <option value="total">Total Amount</option>
          <option value="status">Status</option>
          <option value="createdBy">Created By</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Choose Y-Axis Data</label>
        <select
          value={widget.config.yField || 'total'}
          onChange={(e) => updateConfig('yField', e.target.value)}
          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
        >
          <option value="product">Product</option>
          <option value="quantity">Quantity</option>
          <option value="unitPrice">Unit Price</option>
          <option value="total">Total Amount</option>
          <option value="status">Status</option>
          <option value="createdBy">Created By</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Chart Color</label>
        <div className="flex gap-3 items-center">
          <input
            type="color"
            value={widget.config.color || '#10b981'}
            onChange={(e) => updateConfig('color', e.target.value)}
            className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
          />
          <input
            type="text"
            value={widget.config.color || '#10b981'}
            onChange={(e) => updateConfig('color', e.target.value)}
            className="flex-1 px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-mono transition-colors"
            placeholder="#10b981"
          />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="showLabel"
          checked={widget.config.showLabel || false}
          onChange={(e) => updateConfig('showLabel', e.target.checked)}
          className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
        />
        <label htmlFor="showLabel" className="text-sm font-medium text-gray-700">Show Data Labels</label>
      </div>
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="showLegend"
          checked={widget.config.showLegend !== false}
          onChange={(e) => updateConfig('showLegend', e.target.checked)}
          className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
        />
        <label htmlFor="showLegend" className="text-sm font-medium text-gray-700">Show Legend</label>
      </div>
    </>
  );

  const renderPieConfig = () => (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Choose Chart Data</label>
        <select
          value={widget.config.dataField || 'status'}
          onChange={(e) => updateConfig('dataField', e.target.value)}
          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
        >
          <option value="product">Product</option>
          <option value="quantity">Quantity</option>
          <option value="unitPrice">Unit Price</option>
          <option value="total">Total Amount</option>
          <option value="status">Status</option>
          <option value="createdBy">Created By</option>
        </select>
      </div>
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="pieLegend"
          checked={widget.config.showLegend !== false}
          onChange={(e) => updateConfig('showLegend', e.target.checked)}
          className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
        />
        <label htmlFor="pieLegend" className="text-sm font-medium text-gray-700">Show Legend</label>
      </div>
    </>
  );

  const renderTableDataConfig = () => {
    const allColumns = ['customerId', 'customerName', 'email', 'phone', 'address', 'orderId', 'orderDate', 'product', 'quantity', 'unitPrice', 'total', 'status', 'createdBy'];
    const currentCols = widget.config.columns || ['customerId', 'customerName', 'product', 'quantity', 'total', 'status'];
    
    return (
      <>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Column Selection</label>
          <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-3 bg-gray-50">
            {allColumns.map(col => (
              <label key={col} className="flex items-center cursor-pointer hover:bg-white p-2 rounded transition-colors">
                <input
                  type="checkbox"
                  checked={currentCols.includes(col)}
                  onChange={(e) => {
                    const newCols = e.target.checked 
                      ? [...currentCols, col] 
                      : currentCols.filter(c => c !== col);
                    updateConfig('columns', newCols);
                  }}
                  className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                />
                <span className="ml-3 text-sm text-gray-700 capitalize">{col.replace(/([A-Z])/g, ' $1').trim()}</span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
          <select
            value={widget.config.sortBy || 'orderDate'}
            onChange={(e) => updateConfig('sortBy', e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
          >
            <option value="orderDate">Order Date</option>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Pagination</label>
          <select
            value={widget.config.pageSize || 5}
            onChange={(e) => updateConfig('pageSize', parseInt(e.target.value))}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
          >
            <option value={5}>5 rows per page</option>
            <option value={10}>10 rows per page</option>
            <option value={15}>15 rows per page</option>
          </select>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="applyFilter"
            checked={widget.config.applyFilter || false}
            onChange={(e) => updateConfig('applyFilter', e.target.checked)}
            className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
          />
          <label htmlFor="applyFilter" className="text-sm font-medium text-gray-700">Apply Filter</label>
        </div>
      </>
    );
  };

  const renderTableStylingConfig = () => {
    return (
      <>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Font Size</label>
          <input
            type="number"
            min="12"
            max="18"
            value={widget.config.fontSize || 14}
            onChange={(e) => {
              const val = parseInt(e.target.value) || 14;
              updateConfig('fontSize', Math.max(12, Math.min(18, val)));
            }}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
          />
          <p className="text-xs text-gray-500 mt-1">Range: 12-18px</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Header Background</label>
          <div className="flex gap-3 items-center">
            <input
              type="color"
              value={widget.config.headerBg || '#54bd95'}
              onChange={(e) => updateConfig('headerBg', e.target.value)}
              className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
            />
            <input
              type="text"
              value={widget.config.headerBg || '#54bd95'}
              onChange={(e) => updateConfig('headerBg', e.target.value)}
              className="flex-1 px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-mono transition-colors"
              placeholder="#54bd95"
            />
          </div>
        </div>
      </>
    );
  };

  const [activeTab, setActiveTab] = useState('data');

  return (
    <div className="w-full md:w-96 bg-white border-l border-gray-200 shadow-lg flex flex-col h-full">
      {/* Panel Header */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 flex-shrink-0">
        <h3 className="text-lg font-semibold text-gray-900">Widget configuration</h3>
        <button 
          onClick={onClose} 
          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X size={18} className="text-gray-500" />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Widget Info Section */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Widget Info</h4>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Widget title</label>
              <input
                type="text"
                value={widget.config.title || ''}
                onChange={(e) => updateConfig('title', e.target.value)}
                onBlur={validateTitle}
                className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors ${
                  errors.title ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Enter widget title"
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">{errors.title}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Widget type</label>
              <input
                type="text"
                value={widget.type.charAt(0).toUpperCase() + widget.type.slice(1)}
                readOnly
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-600 text-sm cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={widget.config.description || ''}
                onChange={(e) => updateConfig('description', e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors resize-none"
                rows="3"
                placeholder="Optional description"
              />
            </div>
          </div>

          {/* Widget Size Section */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Widget Size</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Width (Columns)</label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={widget.w || 4}
                  onChange={(e) => updateSize('w', e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Height (Rows)</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={widget.h || 3}
                  onChange={(e) => updateSize('h', e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Data Settings Section */}
          {widget.type === 'table' ? (
            <div className="space-y-4">
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveTab('data')}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'data'
                      ? 'border-emerald-500 text-emerald-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Data
                </button>
                <button
                  onClick={() => setActiveTab('styling')}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'styling'
                      ? 'border-emerald-500 text-emerald-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Styling
                </button>
              </div>
              
              <div className="space-y-4">
                {activeTab === 'data' ? (
                  <>
                    <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Data Settings</h4>
                    {renderTableDataConfig()}
                  </>
                ) : (
                  <>
                    <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Styling Settings</h4>
                    {renderTableStylingConfig()}
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Data Settings</h4>
              
              <div className="space-y-4">
                {widget.type === 'kpi' && renderKPIConfig()}
                {['bar', 'line', 'area', 'scatter'].includes(widget.type) && renderChartConfig()}
                {widget.type === 'pie' && renderPieConfig()}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sticky Footer */}
      <div className="border-t border-gray-100 px-6 py-4 bg-gray-50 flex-shrink-0">
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default WidgetConfig;
