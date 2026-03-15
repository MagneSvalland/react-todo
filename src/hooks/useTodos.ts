import { useState, useEffect, useCallback } from 'react'
import { Todo, Priority, Filter } from '../types'

const STORAGE_KEY = 'react-todo:todos'
const THEME_KEY = 'react-todo:theme'

function loadFromStorage(): Todo[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Todo[]) : []
  } catch {
    return []
  }
}

export function useTheme() {
  const [dark, setDark] = useState<boolean>(() => {
    const saved = localStorage.getItem(THEME_KEY)
    if (saved) return saved === 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
    localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light')
  }, [dark])

  return { dark, toggleTheme: () => setDark(d => !d) }
}

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>(loadFromStorage)
  const [filter, setFilter] = useState<Filter>('all')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }, [todos])

  const addTodo = useCallback((text: string, priority: Priority, dueDate?: string) => {
    if (!text.trim()) return
    setTodos(prev => [
      {
        id: crypto.randomUUID(),
        text: text.trim(),
        completed: false,
        priority,
        createdAt: Date.now(),
        dueDate,
      },
      ...prev,
    ])
  }, [])

  const toggleTodo = useCallback((id: string) => {
    setTodos(prev =>
      prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t))
    )
  }, [])

  const deleteTodo = useCallback((id: string) => {
    setTodos(prev => prev.filter(t => t.id !== id))
  }, [])

  const editTodo = useCallback((id: string, text: string) => {
    if (!text.trim()) return
    setTodos(prev =>
      prev.map(t => (t.id === id ? { ...t, text: text.trim() } : t))
    )
  }, [])

  const clearCompleted = useCallback(() => {
    setTodos(prev => prev.filter(t => !t.completed))
  }, [])

  const filtered = todos.filter(t => {
    if (filter === 'active') return !t.completed
    if (filter === 'completed') return t.completed
    return true
  })

  const activeCount = todos.filter(t => !t.completed).length
  const completedCount = todos.filter(t => t.completed).length

  return {
    todos: filtered,
    filter,
    setFilter,
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
    clearCompleted,
    activeCount,
    completedCount,
  }
}