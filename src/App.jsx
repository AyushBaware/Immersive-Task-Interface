import { TodoProvider } from './Contexts'
import './App.css'
import { useEffect, useState } from 'react'
import { TodoItem, TodoForm } from './Components'
import Scene from './Components/Three/Scene'

function App() {
  // FIX: Initialize state directly from localStorage to avoid the "cascading render" error
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem("todos")
    return savedTodos ? JSON.parse(savedTodos) : []
  })
  
  const [ripple, setRipple] = useState(false)

  const triggerRipple = () => {
    setRipple(true)
    setTimeout(() => setRipple(false), 500)
  }

  const addTodo = (todo) => {
    setTodos((prev) => [{ id: Date.now(), ...todo }, ...prev])
  }

  const updateTodo = (id, todo) => {
    setTodos((prev) => prev.map((prevTodo) => (prevTodo.id === id ? todo : prevTodo)))
  }

  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id))
  }

  const toggleComplete = (id) => {
    setTodos((prev) => prev.map((prevTodo) => 
      prevTodo.id === id ? { ...prevTodo, completed: !prevTodo.completed } : prevTodo))
  }

  // ✅ Keep this effect ONLY for SAVING, not loading
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos))
  }, [todos])

  return (
    <TodoProvider value={{ todos, addTodo, updateTodo, deleteTodo, toggleComplete, ripple, triggerRipple }}>
      {/* Container must be relative and have NO solid background color */}
      <div className="relative min-h-screen w-full overflow-hidden">
        
        {/* 1. The 3D Background Layer (Fixed position behind everything) */}
        <Scene />

        {/* 2. The UI Layer (Transparent wrapper) */}
        <div className="relative z-10 min-h-screen py-8 px-4 flex flex-col items-center pointer-events-none">
          {/* pointer-events-auto allows you to click the box, while the wrapper lets mouse move to 3D */}
          <div className="w-full max-w-2xl 
                backdrop-blur-[20px] bg-white/5 
                border border-white/10 
                shadow-[0_0_50px_rgba(0,229,255,0.2)] 
                rounded-[40px] px-8 py-12 text-white">
            
            <h1 className="text-5xl font-black text-center mb-12 tracking-tighter uppercase italic drop-shadow-[0_5px_15px_rgba(0,229,255,0.8)]">
              Virtual Tasks
            </h1>

            <div className="mb-10">
              <TodoForm />
            </div>

            <div className="flex flex-col gap-y-4">
              {todos.length > 0 ? (
                todos.map((todo) => (
                  <div key={todo.id} className="w-full transition-all duration-500 hover:scale-[1.02]">
                    <TodoItem todo={todo} />
                  </div>
                ))
              ) : (
                <p className="text-center text-white/30 italic">No tasks in orbit...</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </TodoProvider>
  )
}

export default App