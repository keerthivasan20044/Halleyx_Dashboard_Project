import { useMemo, memo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const BarChartWidget = ({ config, data = [] }) => {
  const chartData = useMemo(() => {
    const xField = config.xField || 'product';
    const yField = config.yField || 'total';
    
    const grouped = data.reduce((acc, item) => {
      const key = item[xField];
      if (!acc[key]) acc[key] = 0;
      acc[key] += item[yField] || 0;
      return acc;
    }, {});

    return Object.entries(grouped).map(([name, value]) => ({ name, value }));
  }, [data, config.xField, config.yField]);

  const color = config.color || '#10b981';

  return (
    <div className="h-full flex flex-col">
      <h3 className="text-lg font-semibold text-gray-900 mb-1">{config.title}</h3>
      {config.description && (
        <p className="text-sm text-gray-500 mb-3">{config.description}</p>
      )}
      <div className="flex-1" style={{ minHeight: 0, height: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="value" fill={color} label={config.showLabel ? { position: 'top', fontSize: 12 } : false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default memo(BarChartWidget);
