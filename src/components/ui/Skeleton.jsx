import clsx from 'clsx'

export function Skeleton({ className = '', rounded = 'rounded-lg' }) {
  return (
    <div className={clsx('animate-pulse bg-white/5', rounded, className)} />
  )
}

export function KPICardSkeleton() {
  return (
    <div className="glass rounded-2xl p-5 md:p-6 space-y-4">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-8 w-32" />
        </div>
        <Skeleton className="h-10 w-10 rounded-xl" />
      </div>
      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-8 w-24" rounded="rounded-lg" />
      </div>
    </div>
  )
}

export function ChartSkeleton({ height = 'h-64' }) {
  return (
    <div className={clsx('glass rounded-2xl p-5 md:p-6', height)}>
      <div className="flex items-start justify-between mb-6">
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-48" />
        </div>
        <Skeleton className="h-8 w-28 rounded-xl" />
      </div>
      <div className="h-[calc(100%-80px)] flex items-end gap-2">
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton
            key={i}
            className="flex-1"
            style={{ height: `${30 + Math.random() * 70}%` }}
            rounded="rounded-t-md"
          />
        ))}
      </div>
    </div>
  )
}

export default Skeleton
