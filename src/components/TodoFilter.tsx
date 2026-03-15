import { Filter } from '../types'

interface Props {
  filter: Filter
  setFilter: (f: Filter) => void
  activeCount: number
  completedCount: number
  onClearCompleted: () => void
}

export function TodoFilter({
  filter,
  setFilter,
  activeCount,
  completedCount,
  onClearCompleted,
}: Props) {
  return (
    <div className="filter-bar">
      <span className="count-label">
        {activeCount} {activeCount === 1 ? 'task' : 'tasks'} left
      </span>
      <div className="filter-group">
        {(['all', 'active', 'completed'] as Filter[]).map(f => (
          <button
            key={f}
            className={`filter-btn${filter === f ? ' active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>
      {completedCount > 0 && (
        <button className="clear-btn" onClick={onClearCompleted}>
          Clear {completedCount} done
        </button>
      )}
    </div>
  )
}