import { Card } from 'primereact/card'
import { Skeleton } from 'primereact/skeleton'

interface LoadingSkeletonProps {
  type?: 'card' | 'list' | 'table' | 'stats'
  count?: number
}

export const LoadingSkeleton = ({ type = 'card', count = 3 }: LoadingSkeletonProps) => {
  const renderCardSkeleton = () => (
    <Card className="card-modern">
      <div className="flex flex-column gap-3">
        <div className="flex align-items-center gap-2">
          <Skeleton shape="circle" size="3rem" />
          <div className="flex-1">
            <Skeleton width="60%" height="1rem" className="mb-2" />
            <Skeleton width="40%" height="0.8rem" />
          </div>
        </div>
        <Skeleton width="100%" height="1.2rem" />
        <Skeleton width="80%" height="1rem" />
        <Skeleton width="100%" height="3rem" />
        <div className="flex gap-2">
          <Skeleton width="48%" height="2.5rem" />
          <Skeleton width="48%" height="2.5rem" />
        </div>
      </div>
    </Card>
  )

  const renderListSkeleton = () => (
    <div className="flex align-items-center gap-3 p-3 border-round surface-100 mb-2">
      <Skeleton shape="circle" size="2.5rem" />
      <div className="flex-1">
        <Skeleton width="70%" height="1rem" className="mb-2" />
        <Skeleton width="50%" height="0.8rem" />
      </div>
      <Skeleton width="20%" height="2rem" />
    </div>
  )

  const renderTableSkeleton = () => (
    <Card>
      <div className="flex flex-column gap-2">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex align-items-center gap-3 p-2">
            <Skeleton width="30%" height="1rem" />
            <Skeleton width="20%" height="1rem" />
            <Skeleton width="15%" height="1rem" />
            <Skeleton width="15%" height="1rem" />
            <Skeleton width="20%" height="1rem" />
          </div>
        ))}
      </div>
    </Card>
  )

  const renderStatsSkeleton = () => (
    <Card>
      <div className="flex justify-content-between align-items-center">
        <div className="flex-1">
          <Skeleton width="60%" height="0.8rem" className="mb-2" />
          <Skeleton width="40%" height="1.5rem" />
        </div>
        <Skeleton shape="circle" size="2.5rem" />
      </div>
    </Card>
  )

  const renderSkeleton = () => {
    switch (type) {
      case 'list':
        return renderListSkeleton()
      case 'table':
        return renderTableSkeleton()
      case 'stats':
        return renderStatsSkeleton()
      default:
        return renderCardSkeleton()
    }
  }

  if (type === 'table') {
    return renderSkeleton()
  }

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={type === 'card' ? 'col-12 md:col-6 lg:col-4' : ''}>
          {renderSkeleton()}
        </div>
      ))}
    </>
  )
}