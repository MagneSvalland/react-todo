import { useState, KeyboardEvent } from 'react'
import { Priority } from '../types'

interface Props {
  onAdd: (text: string, priority: Priority, dueDate?: string) => void
}

export function TodoInput({ onAdd }: Props) {
  const [text, setText] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')
  const [dueDate, setDueDate] = useState('')

  const handleAdd = () => {
    onAdd(text, priority, dueDate || undefined)
    setText('')
    setDueDate('')
  }

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleAdd()
  }

  return (
    <div className="input-wrapper">
      <div className="input-row">
        <input
          className="todo-input"
          type="text"
          placeholder="Add a task..."
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={handleKey}
          autoFocus
        />
        <div className="priority-group">
          {(['low', 'medium', 'high'] as Priority[]).map(p => (
            <button
              key={p}
              className={`priority-btn priority-${p}${priority === p ? ' active' : ''}`}
              onClick={() => setPriority(p)}
              title={p}
            >
              {p[0].toUpperCase()}
            </button>
          ))}
        </div>
        <button className="add-btn" onClick={handleAdd} disabled={!text.trim()}>
          Add
        </button>
      </div>
      <div className="date-row">
        <label className="date-label">Due date</label>
        <input
          className="date-input"
          type="date"
          value={dueDate}
          onChange={e => setDueDate(e.target.value)}
        />
      </div>
    </div>
  )
}