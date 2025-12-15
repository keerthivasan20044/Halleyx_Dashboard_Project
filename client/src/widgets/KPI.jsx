import { useMemo } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const AGGREGATION_TYPES = {
  SUM: 'Sum',
  AVERAGE: 'Average',
  COUNT: 'Count',
  MAX: 'Max',
  MIN: 'Min',
};

const ICON_COLORS = {
  emerald: 'bg-emerald-100 text-emerald-600',
  blue: 'bg-blue-100 text-blue-600',
  amber: 'bg-amber-100 text-amber-600',
  rose: 'bg-rose-100 text-rose-600',
  purple: 'bg-purple-100 text-purple-600',
  cyan: 'bg-cyan-100 text-cyan-600',
};

export default function KPIWidget({ config, data }) {
  // Calculate the aggregated value based on config
  const value = useMemo(() => {
    if (!data || data.length === 0) return 0;

    const metric = config.metric || 'totalAmount';
    const aggregation = config.aggregation || AGGREGATION_TYPES.SUM;

    const values = data
      .map((item) => parseFloat(item[metric]) || 0)
      .filter((v) => v !== null && v !== undefined);

    if (values.length === 0) return 0;

    switch (aggregation) {
      case AGGREGATION_TYPES.SUM:
        return values.reduce((sum, val) => sum + val, 0);

      case AGGREGATION_TYPES.AVERAGE:
        return values.reduce((sum, val) => sum + val, 0) / values.length;

      case AGGREGATION_TYPES.COUNT:
        return data.length;

      case AGGREGATION_TYPES.MAX:
        return Math.max(...values);

      case AGGREGATION_TYPES.MIN:
        return Math.min(...values);

      default:
        return values.reduce((sum, val) => sum + val, 0);
    }
  }, [data, config.metric, config.aggregation]);

  // Format the value according to config
  const formattedValue = useMemo(() => {
    const precision = config.decimalPrecision ?? 0;

    if (config.dataFormat === 'Currency') {
      return `$${value.toLocaleString('en-US', {
        minimumFractionDigits: precision,
        maximumFractionDigits: precision,
      })}`;
    }

    if (config.dataFormat === 'Percentage') {
      return `${value.toFixed(precision)}%`;
    }

    return value.toLocaleString('en-US', {
      minimumFractionDigits: precision,
      maximumFractionDigits: precision,
    });
  }, [value, config.dataFormat, config.decimalPrecision]);

  // Calculate trend
  const trend = parseFloat(config.trendValue) || 2.5;
  const isTrendPositive = trend >= 0;

  // Get icon color
  const iconColor = ICON_COLORS[config.iconColor] || ICON_COLORS.emerald;

  // Get icon from assets if available
  const IconComponent = isTrendPositive ? TrendingUp : TrendingDown;
  const trendColor = isTrendPositive ? 'text-emerald-600' : 'text-red-600';
  const trendBackground = isTrendPositive ? 'bg-emerald-50' : 'bg-red-50';

  return (
    <div className="h-full rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-gray-300">
      {/* Header with Title and Icon */}
      <div className="mb-6 flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            {config.title || 'Untitled Metric'}
          </p>
          <h3 className="mt-2 text-3xl font-bold text-gray-900 break-words">
            {formattedValue}
          </h3>
        </div>

        {config.showIcon !== false && (
          <div className={`flex-shrink-0 rounded-lg p-2 ${iconColor}`}>
            <svg
              className="h-5 w-5"
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
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="mb-4 h-px bg-gray-100"></div>

      {/* Trend Footer */}
      {config.showTrend !== false && (
        <div className={`flex items-center gap-2 rounded-lg ${trendBackground} px-3 py-2`}>
          <IconComponent className={`h-4 w-4 flex-shrink-0 ${trendColor}`} />
          <span className={`text-sm font-medium ${trendColor}`}>
            {isTrendPositive ? '+' : ''}{trend.toFixed(1)}% from last month
          </span>
        </div>
      )}

      {/* Footer */}
      {config.footerText && (
        <div className="mt-3 text-xs text-gray-500">
          {config.footerText}
        </div>
      )}
    </div>
  );
}
