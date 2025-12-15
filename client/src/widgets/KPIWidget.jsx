import { memo, useMemo } from 'react';

const KPIWidget = ({ config, data = [] }) => {
  const numericFields = ['quantity', 'unitPrice', 'total'];
  const metric = config.metric || 'total';
  const aggregation = config.aggregation || 'sum';
  
  const isNumericMetric = numericFields.includes(metric);
  
  const calculateValue = useMemo(() => {
    if (aggregation === 'count') return data.length;
    
    if (!isNumericMetric) return null;
    
    const values = data.map(d => {
      const val = d[metric];
      return typeof val === 'number' ? val : parseFloat(val) || 0;
    }).filter(v => !isNaN(v));
    
    if (values.length === 0) return 0;
    
    if (aggregation === 'sum') return values.reduce((a, b) => a + b, 0);
    if (aggregation === 'average') return values.reduce((a, b) => a + b, 0) / values.length;
    
    return 0;
  }, [data, metric, aggregation, isNumericMetric]);

  const formatValue = (value) => {
    if (value === null) return '—';
    if (isNaN(value)) return '—';
    
    const decimals = config.decimals ?? 0;
    const formatted = value.toFixed(decimals);
    return config.format === 'currency' ? `$${formatted}` : formatted;
  };

  return (
    <div className="h-full flex flex-col justify-center">
      <h3 className="text-lg font-semibold text-gray-900 mb-1">{config.title}</h3>
      {config.description && (
        <p className="text-sm text-gray-500 mb-3">{config.description}</p>
      )}
      <div className="text-4xl font-bold text-primary">{formatValue(calculateValue)}</div>
    </div>
  );
};

export default memo(KPIWidget);
