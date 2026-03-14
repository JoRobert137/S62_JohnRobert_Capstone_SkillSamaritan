import React from 'react';

const SkeletonCard = ({
  variant = 'default',
  className = '',
  count = 1,
}) => {
  const renderStatCard = (index) => (
    <div
      key={`stat-${index}`}
      className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 shadow-[0_12px_24px_rgba(0,0,0,0.3)]"
    >
      <div className="mb-4 h-3 w-24 animate-pulse rounded bg-slate-700/70" />
      <div className="h-8 w-20 animate-pulse rounded bg-slate-700/80" />
      <div className="mt-4 h-10 w-10 animate-pulse rounded-xl bg-slate-700/80" />
    </div>
  );

  const renderTaskCard = (index) => (
    <div
      key={`task-${index}`}
      className="rounded-xl border border-white/10 bg-slate-900/60 p-4 shadow-[0_10px_24px_rgba(0,0,0,0.28)]"
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="h-4 w-2/3 animate-pulse rounded bg-slate-700/80" />
        <div className="h-5 w-16 animate-pulse rounded-full bg-slate-700/70" />
      </div>
      <div className="mb-2 h-3 w-full animate-pulse rounded bg-slate-700/70" />
      <div className="mb-4 h-3 w-4/5 animate-pulse rounded bg-slate-700/70" />
      <div className="flex items-center justify-between">
        <div className="h-3 w-16 animate-pulse rounded bg-slate-700/70" />
        <div className="h-3 w-24 animate-pulse rounded bg-slate-700/70" />
      </div>
    </div>
  );

  const renderFeedItem = (index) => (
    <div
      key={`feed-${index}`}
      className="rounded-xl border border-white/10 bg-slate-900/60 px-3 py-3"
    >
      <div className="mb-2 h-3 w-4/5 animate-pulse rounded bg-slate-700/80" />
      <div className="h-2.5 w-16 animate-pulse rounded bg-slate-700/70" />
    </div>
  );

  const renderers = {
    stat: renderStatCard,
    task: renderTaskCard,
    feed: renderFeedItem,
    default: renderTaskCard,
  };

  const selectedRenderer = renderers[variant] || renderers.default;

  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: count }, (_, index) => selectedRenderer(index))}
    </div>
  );
};

export default SkeletonCard;
