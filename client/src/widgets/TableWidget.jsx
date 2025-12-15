import { useState, memo } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

const TableWidget = ({ config, data = [] }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const columns = config.columns || ['product', 'quantity', 'unitPrice', 'total', 'status'];
  const fontSize = config.fontSize || 14;
  const headerBg = config.headerBg || '#f9fafb';
  const sortField = config.sortBy || 'createdAt';
  const sortDirection = config.sortOrder || 'asc';
  const rowsPerPage = config.pageSize || 5;

  const handleSort = (field) => {
    // Sorting handled by config
  };

  const sortedData = [...data].sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];
    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedData.length / rowsPerPage);
  const paginatedData = sortedData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const formatValue = (value, col) => {
    if (col === 'unitPrice' || col === 'total') return `$${value}`;
    return value;
  };

  return (
    <div className="h-full flex flex-col">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">{config.title}</h3>
      <div className="flex-1 overflow-auto">
        <table className="w-full" style={{ fontSize: `${fontSize}px` }}>
          <thead style={{ backgroundColor: headerBg }} className="sticky top-0">
            <tr>
              {columns.map(col => (
                <th
                  key={col}
                  onClick={() => handleSort(col)}
                  className="px-4 py-2 text-left font-semibold text-gray-700 cursor-pointer hover:bg-gray-200 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="capitalize">{col}</span>
                    {sortField === col && (
                      sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, idx) => (
              <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                {columns.map(col => (
                  <td key={col} className="px-4 py-2 text-gray-700">
                    {formatValue(row[col], col)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-3 pt-3 border-t border-gray-200">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded ${
                currentPage === page
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default memo(TableWidget);
