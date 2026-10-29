import React from 'react';

export const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-giftly-border/70 shadow-card animate-pulse flex flex-col justify-between">
      <div className="aspect-[4/3] w-full bg-slate-100" />
      <div className="p-5 space-y-4">
        <div className="flex justify-between items-center">
          <div className="h-6 w-20 bg-slate-100 rounded-md" />
          <div className="h-4 w-12 bg-slate-100 rounded-md" />
        </div>
        <div className="h-5 w-3/4 bg-slate-100 rounded-md" />
        <div className="h-3.5 w-full bg-slate-100 rounded-md" />
        <div className="h-3.5 w-4/5 bg-slate-100 rounded-md" />
        <div className="h-12 w-full bg-purple-50/60 rounded-2xl" />
        <div className="pt-2 border-t border-slate-100 flex justify-between">
          <div className="h-3 w-16 bg-slate-100 rounded-md" />
          <div className="h-4 w-20 bg-slate-100 rounded-md" />
        </div>
      </div>
    </div>
  );
};
