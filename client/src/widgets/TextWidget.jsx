export default function TextWidget({ config }) {
  const content = config?.content || config?.config?.content || '';
  const fontSize = Number(config?.fontSize || config?.config?.fontSize || 14);
  const textColor = config?.textColor || config?.config?.textColor || 'text-gray-900';
  const alignment = config?.alignment || config?.config?.alignment || 'left';
  const fontWeight = config?.fontWeight || config?.config?.fontWeight || 'normal';

  const fontWeightClass = {
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
    extrabold: 'font-extrabold',
  }[fontWeight] || 'font-normal';

  const alignmentClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
    justify: 'text-justify',
  }[alignment] || 'text-left';

  return (
    <div className="h-full w-full rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-gray-300">
      <div className="space-y-3">
        {config.title && (
          <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            {config.title}
          </h3>
        )}

        {config.description && (
          <p className="text-xs text-gray-500">{config.description}</p>
        )}

        <div
          className={`overflow-auto whitespace-pre-wrap break-words ${textColor} ${fontWeightClass} ${alignmentClass}`}
          style={{ fontSize: `${fontSize}px` }}
        >
          {content || 'No content provided'}
        </div>
      </div>
    </div>
  );
}
