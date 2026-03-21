import React from 'react';

const SkeletonCard = ({
  variant = 'default',
  className = '',
  count = 1,
}) => {
  const renderStatCard = (index) => (
    <div
      key={`stat-${index}`}
      className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
    >
      <div className="mb-4 h-3 w-24 animate-pulse rounded bg-[#E5ECE8]" />
      <div className="h-8 w-20 animate-pulse rounded bg-[#E5ECE8]" />
      <div className="mt-4 h-10 w-10 animate-pulse rounded-xl bg-[#E5ECE8]" />
    </div>
  );

  const renderTaskCard = (index) => (
    <div
      key={`task-${index}`}
      className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="h-5 w-2/3 animate-pulse rounded bg-[#E5ECE8]" />
        <div className="h-5 w-16 animate-pulse rounded-full bg-[#E5ECE8]" />
      </div>
      <div className="mb-2 h-3 w-full animate-pulse rounded bg-[#E5ECE8]" />
      <div className="mb-2 h-3 w-11/12 animate-pulse rounded bg-[#E5ECE8]" />
      <div className="mb-5 h-3 w-4/5 animate-pulse rounded bg-[#E5ECE8]" />
      <div className="mb-4 flex gap-2">
        <div className="h-6 w-16 animate-pulse rounded-full bg-[#E5ECE8]" />
        <div className="h-6 w-20 animate-pulse rounded-full bg-[#E5ECE8]" />
      </div>
      <div className="mb-6 space-y-2">
        <div className="h-3 w-40 animate-pulse rounded bg-[#E5ECE8]" />
        <div className="h-3 w-28 animate-pulse rounded bg-[#E5ECE8]" />
        <div className="h-3 w-36 animate-pulse rounded bg-[#E5ECE8]" />
      </div>
      <div className="flex gap-2">
        <div className="h-9 w-28 animate-pulse rounded-lg bg-[#E5ECE8]" />
        <div className="h-9 w-24 animate-pulse rounded-lg bg-[#E5ECE8]" />
      </div>
    </div>
  );

  const renderFeedItem = (index) => (
    <div
      key={`feed-${index}`}
      className="rounded-xl border border-gray-100 bg-white px-3 py-3 shadow-sm"
    >
      <div className="mb-2 h-3 w-4/5 animate-pulse rounded bg-[#E5ECE8]" />
      <div className="h-2.5 w-16 animate-pulse rounded bg-[#E5ECE8]" />
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
