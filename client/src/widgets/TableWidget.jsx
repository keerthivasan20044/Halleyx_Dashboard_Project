import { useState, memo, useMemo, useCallback } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

const TableWidget = ({ config = {}, data = [] }) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Validate and sanitize config
  const safeConfig = useMemo(() => {
    try {
      return {
        columns: Array.isArray(config.columns) ? config.columns : ['product', 'quantity', 'unitPrice', 'total', 'status'],
        fontSize: typeof config.fontSize === 'number' && config.fontSize > 0 ? config.fontSize : 14,
        headerBg: typeof config.headerBg === 'string' ? config.headerBg : '#f9fafb',
        sortBy: typeof config.sortBy === 'string' ? config.sortBy : 'createdAt',
        sortOrder: config.sortOrder === 'desc' ? 'desc' : 'asc',
        pageSize: typeof config.pageSize === 'number' && config.pageSize > 0 ? config.pageSize : 5,
        title: typeof config.title === 'string' ? config.title : 'Table'
      }
    } catch (error) {
      console.error('TableWidget config error:', error)
      return {
        columns: ['product', 'quantity', 'unitPrice', 'total', 'status'],
        fontSize: 14,
        headerBg: '#f9fafb',
        sortBy: 'createdAt',
        sortOrder: 'asc',
        pageSize: 5,
        title: 'Table'
      }
    }
  }, [config])

  // Validate data
  const safeData = useMemo(() => {
    try {
      return Array.isArray(data) ? data.filter(item => item && typeof item === 'object') : []
    } catch (error) {
      console.error('TableWidget data error:', error)
      return []
    }
  }, [data])

  const handleSort = useCallback((field) => {
    try {
      // Sorting handled by config - could be extended for interactive sorting
      console.log('Sort by:', field)
    } catch (error) {
      console.error('Sort error:', error)
    }
  }, [])

  const sortedData = useMemo(() => {
    try {
      if (safeData.length === 0) return []
      
      return [...safeData].sort((a, b) => {
        try {
          const aVal = a[safeConfig.sortBy]
          const bVal = b[safeConfig.sortBy]
          
          // Handle null/undefined values
          if (aVal == null && bVal == null) return 0
          if (aVal == null) return 1
          if (bVal == null) return -1
          
          // Convert to strings for comparison
          const aStr = String(aVal).toLowerCase()
          const bStr = String(bVal).toLowerCase()
          
          if (aStr < bStr) return safeConfig.sortOrder === 'asc' ? -1 : 1
          if (aStr > bStr) return safeConfig.sortOrder === 'asc' ? 1 : -1
          return 0
        } catch (error) {
          console.error('Sort comparison error:', error)
          return 0
        }
      })
    } catch (error) {
      console.error('Sorting error:', error)
      return safeData
    }
  }, [safeData, safeConfig.sortBy, safeConfig.sortOrder])

  const totalPages = Math.max(1, Math.ceil(sortedData.length / safeConfig.pageSize))
  
  const paginatedData = useMemo(() => {
    try {
      const startIndex = (currentPage - 1) * safeConfig.pageSize
      const endIndex = startIndex + safeConfig.pageSize
      return sortedData.slice(startIndex, endIndex)
    } catch (error) {
      console.error('Pagination error:', error)
      return sortedData.slice(0, safeConfig.pageSize)
    }
  }, [sortedData, currentPage, safeConfig.pageSize])

  const formatValue = useCallback((value, col) => {
    try {
      if (value == null) return '-'
      
      if (col === 'unitPrice' || col === 'total') {
        const numValue = parseFloat(value)
        return isNaN(numValue) ? '$0.00' : `$${numValue.toFixed(2)}`
      }
      
      return String(value)
    } catch (error) {
      console.error('Format value error:', error)
      return '-'
    }
  }, [])

  const handlePageChange = useCallback((page) => {
    try {
      if (page >= 1 && page <= totalPages) {
        setCurrentPage(page)
      }
    } catch (error) {
      console.error('Page change error:', error)
    }
  }, [totalPages])

  return (
    <div className="h-full flex flex-col">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">{safeConfig.title}</h3>
      <div className="flex-1 overflow-auto">
        {paginatedData.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-gray-500">
            No data available
          </div>
        ) : (
          <table className="w-full" style={{ fontSize: `${safeConfig.fontSize}px` }}>
            <thead style={{ backgroundColor: safeConfig.headerBg }} className="sticky top-0">
              <tr>
                {safeConfig.columns.map(col => (
                  <th
                    key={col}
                    onClick={() => handleSort(col)}
                    className="px-4 py-2 text-left font-semibold text-gray-700 cursor-pointer hover:bg-gray-200 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="capitalize">{String(col).replace(/([A-Z])/g, ' $1').trim()}</span>
                      {safeConfig.sortBy === col && (
                        safeConfig.sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((row, idx) => (
                <tr key={row.id || row._id || idx} className="border-b border-gray-200 hover:bg-gray-50">
                  {safeConfig.columns.map(col => (
                    <td key={col} className="px-4 py-2 text-gray-700">
                      {formatValue(row[col], col)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-3 pt-3 border-t border-gray-200">
          {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => {
            const page = i + 1
            return (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1 rounded transition-colors ${
                  currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                aria-label={`Go to page ${page}`}
              >
                {page}
              </button>
            )
          })}
          {totalPages > 10 && (
            <span className="px-3 py-1 text-gray-500">...</span>
          )}
        </div>
      )}
    </div>
  );
}

export default memo(TableWidget);
