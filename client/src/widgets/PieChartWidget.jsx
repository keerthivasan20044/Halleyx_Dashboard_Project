import { useMemo, memo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = ['#10b981', '#6366f1', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const PieChartWidget = ({ config, data = [] }) => {
  const chartData = useMemo(() => {
    const dataField = config.dataField || 'status';
    const valueField = config.valueField || 'count';
    
    const grouped = data.reduce((acc, item) => {
      const key = item[dataField];
      if (!acc[key]) acc[key] = 0;
      
      if (valueField === 'count') {
        acc[key] += 1;
      } else {
        acc[key] += item[valueField] || 0;
      }
      return acc;
    }, {});

    return Object.entries(grouped).map(([name, value]) => ({ name, value }));
  }, [data, config.dataField, config.valueField]);

  return (
    <div className="h-full flex flex-col">
      <h3 className="text-lg font-semibold text-gray-900 mb-1">{config.title}</h3>
      {config.description && (
        <p className="text-sm text-gray-500 mb-3">{config.description}</p>
      )}
      <div className="flex-1" style={{ minHeight: 0, height: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius="70%"
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            {config.showLegend !== false && <Legend />}
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default memo(PieChartWidget);
