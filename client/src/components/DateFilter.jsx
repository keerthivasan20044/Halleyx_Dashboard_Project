import { Calendar } from 'lucide-react';

const DateFilter = ({ value, onChange }) => {
  const options = [
    { value: 'all', label: 'All time' },
    { value: 'today', label: 'Today' },
    { value: 'last7', label: 'Last 7 Days' },
    { value: 'last30', label: 'Last 30 Days' },
    { value: 'last90', label: 'Last 90 Days' },
  ];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
      <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
        Show data for:
      </label>
      <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-sm min-h-[44px] w-full sm:w-auto">
        <Calendar size={16} className="text-gray-500 flex-shrink-0" />
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="border-none bg-transparent text-sm font-medium text-gray-700 focus:outline-none cursor-pointer flex-1 sm:flex-initial min-w-0"
        >
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default DateFilter;
