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
      className={`rounded-2xl border border-dashed border-white/20 bg-slate-900/60 p-8 text-center shadow-[0_12px_24px_rgba(0,0,0,0.28)] ${className}`}
    >
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-800 text-cyan-300">
        {icon || <span className="text-xl">📭</span>}
      </div>
      <h3 className="text-lg font-semibold text-slate-100">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">{description}</p>

      {actionLabel && onAction ? (
        <button
          type="button"
          onClick={onAction}
          className="mt-5 rounded-xl border border-cyan-300/30 bg-cyan-500/20 px-4 py-2 text-sm font-medium text-cyan-100 transition-all duration-300 hover:-translate-y-0.5 hover:bg-cyan-500/30"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
};

export default EmptyState;
