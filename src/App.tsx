import { useTodos, useTheme } from './hooks/useTodos'
import { TodoInput } from './components/TodoInput'
import { TodoItem } from './components/TodoItem'
import { TodoFilter } from './components/TodoFilter'
import './App.css'

export default function App() {
  const { dark, toggleTheme } = useTheme()
  const {
    todos,
    filter,
    setFilter,
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
    clearCompleted,
    activeCount,
    completedCount,
  } = useTodos()

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-top">
          <div>
            <h1 className="app-title">tasks</h1>
            <p className="app-subtitle">stay focused, ship things</p>
          </div>
          <button className="theme-btn" onClick={toggleTheme} title="Toggle theme">
            {dark ? '☀' : '☾'}
          </button>
        </div>
      </header>

      <main className="app-main">
        <TodoInput onAdd={addTodo} />

        {todos.length > 0 ? (
          <ul className="todo-list">
            {todos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
                onEdit={editTodo}
              />
            ))}
          </ul>
        ) : (
          <p className="empty-state">
            {filter === 'completed'
              ? 'Nothing completed yet.'
              : filter === 'active'
                ? 'All done — nice work.'
                : 'No tasks yet. Add one above.'}
          </p>
        )}

        <TodoFilter
          filter={filter}
          setFilter={setFilter}
          activeCount={activeCount}
          completedCount={completedCount}
          onClearCompleted={clearCompleted}
        />
      </main>
    </div>
  )
}