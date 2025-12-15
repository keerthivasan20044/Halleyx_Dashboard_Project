import { useMemo, memo } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ScatterChartWidget = ({ config, data = [] }) => {
  const chartData = useMemo(() => {
    const xField = config.xField || 'quantity';
    const yField = config.yField || 'total';
    
    return data.map((item, index) => {
      const xVal = typeof item[xField] === 'number' ? item[xField] : parseFloat(item[xField]) || 0;
      const yVal = typeof item[yField] === 'number' ? item[yField] : parseFloat(item[yField]) || 0;
      return {
        x: xVal,
        y: yVal,
        name: item.product || `Point ${index + 1}`,
      };
    });
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
          <ScatterChart margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis type="number" dataKey="x" tick={{ fontSize: 12 }} name={config.xField || 'X'} />
            <YAxis type="number" dataKey="y" tick={{ fontSize: 12 }} name={config.yField || 'Y'} />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <Scatter data={chartData} fill={color} />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default memo(ScatterChartWidget);
