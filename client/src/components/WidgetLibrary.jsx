import { useState } from 'react';
import { BarChart3, LineChart, AreaChart, ScatterChart, PieChart, Table, TrendingUp, ChevronDown, ChevronRight } from 'lucide-react';

const WidgetLibrary = ({ onAddWidget }) => {
  const [expandedSections, setExpandedSections] = useState({ KPIs: true, Charts: true, Tables: true });

  const widgets = [
    { type: 'kpi', label: 'KPI Card', icon: TrendingUp, description: 'Display key metrics' },
    { type: 'bar', label: 'Bar Chart', icon: BarChart3, description: 'Compare values' },
    { type: 'line', label: 'Line Chart', icon: LineChart, description: 'Show trends' },
    { type: 'area', label: 'Area Chart', icon: AreaChart, description: 'Visualize volume' },
    { type: 'scatter', label: 'Scatter Plot', icon: ScatterChart, description: 'Show correlation' },
    { type: 'pie', label: 'Pie Chart', icon: PieChart, description: 'Show distribution' },
    { type: 'table', label: 'Table', icon: Table, description: 'Display data rows' },
  ];

  const sections = [
    { title: 'KPIs', items: widgets.filter(w => w.type === 'kpi') },
    { title: 'Charts', items: widgets.filter(w => ['bar', 'line', 'area', 'scatter', 'pie'].includes(w.type)) },
    { title: 'Tables', items: widgets.filter(w => w.type === 'table') }
  ];

  const toggleSection = (title) => {
    setExpandedSections(prev => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <div className="w-full lg:w-72 bg-white lg:border-r border-gray-200 p-4 flex flex-col h-full">
      <h3 className="text-base font-semibold text-gray-900 mb-4 flex-shrink-0 lg:block hidden">Widget Library</h3>
      <div className="space-y-3 overflow-y-auto flex-1">
        {sections.map(({ title, items }) => (
          <div key={title} className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => toggleSection(title)}
              className="w-full px-3 py-2 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
            >
              <span className="text-sm font-semibold text-gray-700">{title}</span>
              {expandedSections[title] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
            {expandedSections[title] && (
              <div className="p-2 space-y-1.5">
                {items.map(({ type, label, icon: Icon }) => (
                  <button
                    key={type}
                    onClick={() => onAddWidget(type)}
                    className="w-full p-2 border border-gray-200 rounded hover:border-primary hover:bg-primary/5 transition-all text-left group flex items-center gap-2 cursor-move"
                  >
                    <div className="p-1 bg-gray-100 rounded group-hover:bg-primary/10 transition-colors flex-shrink-0">
                      <Icon size={16} className="text-gray-600 group-hover:text-primary" />
                    </div>
                    <span className="text-sm font-medium text-gray-900">{label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WidgetLibrary;
