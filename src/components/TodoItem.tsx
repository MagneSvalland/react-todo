import { useState, useRef, useEffect, KeyboardEvent } from 'react'
import { Todo } from '../types'

interface Props {
  todo: Todo
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onEdit: (id: string, text: string) => void
}

function isOverdue(dueDate?: string, completed?: boolean): boolean {
  if (!dueDate || completed) return false
  return new Date(dueDate) < new Date(new Date().toDateString())
}

function formatDate(dueDate: string): string {
  const d = new Date(dueDate)
  return d.toLocaleDateString('no-NO', { day: 'numeric', month: 'short' })
}

export function TodoItem({ todo, onToggle, onDelete, onEdit }: Props) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(todo.text)
  const [visible, setVisible] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true))
  }, [])

  useEffect(() => {
    if (editing) inputRef.current?.focus()
  }, [editing])

  const commitEdit = () => {
    onEdit(todo.id, draft)
    setEditing(false)
  }

  const cancelEdit = () => {
    setDraft(todo.text)
    setEditing(false)
  }

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') commitEdit()
    if (e.key === 'Escape') cancelEdit()
  }

  const overdue = isOverdue(todo.dueDate, todo.completed)

  return (
    <li className={`todo-item${todo.completed ? ' completed' : ''}${visible ? ' visible' : ''}`}>
      <span className={`priority-dot priority-${todo.priority}`} />
      <input
        type="checkbox"
        className="todo-checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
      />
      <div className="todo-content">
        {editing ? (
          <input
            ref={inputRef}
            className="edit-input"
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={handleKey}
            onBlur={commitEdit}
          />
        ) : (
          <span
            className="todo-text"
            onDoubleClick={() => !todo.completed && setEditing(true)}
            title={todo.completed ? '' : 'Double-click to edit'}
          >
            {todo.text}
          </span>
        )}
        {todo.dueDate && (
          <span className={`due-date${overdue ? ' overdue' : ''}`}>
            {overdue ? '⚠ ' : ''}{formatDate(todo.dueDate)}
          </span>
        )}
      </div>
      <button
        className="delete-btn"
        onClick={() => onDelete(todo.id)}
        aria-label="Delete"
      >
        ×
      </button>
    </li>
  )
}