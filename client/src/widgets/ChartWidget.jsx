import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const CHART_COLORS = {
  emerald: '#10b981',
  blue: '#3b82f6',
  amber: '#f59e0b',
  rose: '#ef4444',
  purple: '#8b5cf6',
  cyan: '#06b6d4',
};

export default function ChartWidget({ type, config, data }) {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];
    return data;
  }, [data]);

  const chartColor = CHART_COLORS[config.chartColor] || CHART_COLORS.emerald;
  const xAxisField = config.xAxisField || 'name';
  const yAxisField = config.yAxisField || 'value';
  const showLegend = config.showDataLabel !== false;
  const showGrid = config.showGrid !== false;

  const commonProps = {
    data: chartData,
    margin: { top: 5, right: 20, left: 0, bottom: 5 },
  };

  const tooltipStyle = {
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '0.5rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  };

  return (
    <div className="flex h-full flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-gray-300">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">
          {config.title || 'Chart'}
        </h3>
        <span className="text-xs text-gray-500">
          {chartData.length} records
        </span>
      </div>

      {/* Chart Container */}
      <div className="flex-1 w-full min-h-0">
        {chartData.length === 0 ? (
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
            {type === 'bar-chart' && (
              <BarChart {...commonProps}>
                {showGrid && (
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#f3f4f6"
                    vertical={false}
                  />
                )}
                <XAxis
                  dataKey={xAxisField}
                  stroke="#9ca3af"
                  style={{ fontSize: '12px' }}
                />
                <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={tooltipStyle}
                  cursor={{ fill: 'rgba(16, 185, 129, 0.1)' }}
                />
                {showLegend && <Legend />}
                <Bar
                  dataKey={yAxisField}
                  fill={chartColor}
                  radius={[8, 8, 0, 0]}
                  isAnimationActive={true}
                />
              </BarChart>
            )}

            {type === 'line-chart' && (
              <LineChart {...commonProps}>
                {showGrid && (
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#f3f4f6"
                    vertical={false}
                  />
                )}
                <XAxis
                  dataKey={xAxisField}
                  stroke="#9ca3af"
                  style={{ fontSize: '12px' }}
                />
                <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={tooltipStyle}
                  cursor={{ stroke: chartColor, strokeWidth: 2 }}
                />
                {showLegend && <Legend />}
                <Line
                  type="monotone"
                  dataKey={yAxisField}
                  stroke={chartColor}
                  strokeWidth={2}
                  dot={{ fill: chartColor, r: 5 }}
                  activeDot={{ r: 7 }}
                  isAnimationActive={true}
                />
              </LineChart>
            )}

            {type === 'area-chart' && (
              <AreaChart {...commonProps}>
                {showGrid && (
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#f3f4f6"
                    vertical={false}
                  />
                )}
                <XAxis
                  dataKey={xAxisField}
                  stroke="#9ca3af"
                  style={{ fontSize: '12px' }}
                />
                <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={tooltipStyle}
                  cursor={{ fill: 'rgba(16, 185, 129, 0.1)' }}
                />
                {showLegend && <Legend />}
                <Area
                  type="monotone"
                  dataKey={yAxisField}
                  fill={chartColor}
                  stroke={chartColor}
                  fillOpacity={0.2}
                  isAnimationActive={true}
                />
              </AreaChart>
            )}

            {type === 'scatter-plot' && (
              <ScatterChart {...commonProps}>
                {showGrid && (
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#f3f4f6"
                    vertical={false}
                  />
                )}
                <XAxis
                  dataKey={xAxisField}
                  type="number"
                  stroke="#9ca3af"
                  style={{ fontSize: '12px' }}
                />
                <YAxis
                  dataKey={yAxisField}
                  type="number"
                  stroke="#9ca3af"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  cursor={{ fill: 'rgba(16, 185, 129, 0.1)' }}
                />
                {showLegend && <Legend />}
                <Scatter
                  name={yAxisField}
                  dataKey={yAxisField}
                  fill={chartColor}
                  isAnimationActive={true}
                />
              </ScatterChart>
            )}
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
