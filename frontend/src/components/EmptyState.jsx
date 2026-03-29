import React from 'react';

const EmptyState = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`rounded-2xl border border-dashed border-green-200 bg-gradient-to-b from-white to-green-50/50 p-8 text-center shadow-sm ${className}`}
    >
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
        {icon || <span className="text-xl">📭</span>}
      </div>
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">{description}</p>

      {actionLabel && onAction ? (
        <button
          type="button"
          onClick={onAction}
          className="mt-5 rounded-xl bg-gradient-to-r from-green-500 to-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:from-green-600 hover:to-teal-700 hover:shadow-lg"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
};

export default EmptyState;
