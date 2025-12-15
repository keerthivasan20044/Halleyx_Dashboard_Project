import { useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const COLORS = [
  '#10b981',
  '#3b82f6',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#ec4899',
  '#14b8a6',
  '#f97316',
  '#06b6d4',
  '#6366f1',
];

export default function PieWidget({ config, data }) {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];

    const nameField = config.nameField || 'name';
    const valueField = config.valueField || 'value';

    return data.map((item) => ({
      name: item[nameField] || 'Unknown',
      value: parseFloat(item[valueField]) || 0,
    }));
  }, [data, config.nameField, config.valueField]);

  const validData = useMemo(() => {
    return chartData.filter((item) => item.value > 0);
  }, [chartData]);

  const tooltipStyle = {
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '0.5rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  };

  const innerRadius = config.innerRadius || 0;
  const outerRadius = config.outerRadius || 100;
  const showLabel = config.showLabel !== false;

  return (
    <div className="flex h-full flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-gray-300">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">
          {config.title || 'Pie Chart'}
        </h3>
        <span className="text-xs text-gray-500">
          {validData.length} segments
        </span>
      </div>

      {/* Chart Container */}
      <div className="flex-1 w-full min-h-0">
        {validData.length === 0 ? (
          <div className="flex h-full items-center justify-center rounded-lg bg-gray-50 p-8">
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              <p className="mt-2 text-sm text-gray-600">No data available</p>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={validData}
                cx="50%"
                cy="50%"
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                paddingAngle={2}
                labelLine={false}
                label={
                  showLabel
                    ? ({ name, value, percent }) => {
                        const total = validData.reduce((sum, item) => sum + item.value, 0);
                        return `${name}: ${((value / total) * 100).toFixed(0)}%`;
                      }
                    : null
                }
                fill="#8884d8"
                dataKey="value"
                isAnimationActive={true}
              >
                {validData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(value, name, props) => {
                  const total = validData.reduce((sum, item) => sum + item.value, 0);
                  const percent = ((value / total) * 100).toFixed(1);
                  return [`${value} (${percent}%)`, 'Value'];
                }}
              />
              {config.showLegend !== false && (
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  wrapperStyle={{ paddingTop: '20px' }}
                />
              )}
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
