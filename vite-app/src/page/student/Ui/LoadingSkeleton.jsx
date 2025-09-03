// components/UI/LoadingSkeleton.jsx
import React from 'react';

const SkeletonCard = () => (
  <div className="animate-pulse bg-zinc-800 rounded-lg p-4">
    <div className="h-4 bg-zinc-700 rounded w-3/4 mb-3"></div>
    <div className="h-3 bg-zinc-700 rounded w-1/2"></div>
  </div>
);

const LoadingSkeleton = () => (
  <div className="grid grid-cols-4 gap-2 px-8 py-4 w-full flex-grow">
    <div className="col-span-3 row-span-3">
      <SkeletonCard />
    </div>
    <div className="col-span-1 row-span-1">
      <SkeletonCard />
    </div>
    <div className="col-span-1 row-span-2">
      <SkeletonCard />
    </div>
  </div>
);

export default LoadingSkeleton;
