import { TodoProvider } from './Contexts'
import './App.css'
import { useEffect, useState, useCallback } from 'react'
import { TodoItem, TodoForm } from './Components'
import Scene from './Components/Three/Scene'

function App() {
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem("todos")
    return savedTodos ? JSON.parse(savedTodos) : []
  })
  
  const [ripple, setRipple] = useState(false)
  const [isReady, setIsReady] = useState(false) // ⚡ NEW: Tracking sync

  // ⚡ Sync render: Prevents the "jumping" effect on load
  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const triggerRipple = useCallback(() => {
    setRipple(true)
    setTimeout(() => setRipple(false), 1200); 
  }, [])

  const addTodo = (todoText) => {
    const newTodo = {
      id: Date.now(),
      todo: todoText.todo,
      completed: false,
      angle: Math.random() * Math.PI * 2,
      radius: 3.5 + Math.random() * 1.5, 
      speed: 0.003 + Math.random() * 0.005,
      zOffset: (Math.random() - 0.5) * 2
    }
    setTodos((prev) => [newTodo, ...prev])
    triggerRipple();
  }

  const updateTodo = (id, updatedTodo) => {
    setTodos((prev) => prev.map((todo) => (todo.id === id ? { ...todo, ...updatedTodo } : todo)))
  }

  const deleteTodo = (id) => {
    triggerRipple();
    setTodos((prev) => prev.filter((todo) => todo.id !== id))
  }

  const toggleComplete = (id) => {
    setTodos((prev) => prev.map((todo) => {
      if (todo.id === id) {
        if (!todo.completed) triggerRipple(); 
        return { ...todo, completed: !todo.completed }
      }
      return todo
    }))
  }

  const cleanupSystem = () => {
    const hasCompleted = todos.some(t => t.completed);
    if (!hasCompleted) return;
    triggerRipple();
    setTimeout(() => {
      setTodos(prev => prev.filter(t => !t.completed));
    }, 900);
  }

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos))
  }, [todos])

  return (
    <TodoProvider value={{ todos, addTodo, updateTodo, deleteTodo, toggleComplete, ripple, triggerRipple }}>
      {/* ⚡ Added transition classes to keep the sync cinematic */}
      <div className={`relative h-screen w-full bg-[#010208] overflow-hidden transition-opacity duration-700 ${isReady ? 'opacity-100' : 'opacity-0'}`}>
        
        <div className="fixed inset-0 z-0">
          <Scene />
        </div>

        <div className="relative z-10 h-full w-full p-8 flex flex-col justify-between pointer-events-none">
          <div className="w-full max-w-md pointer-events-auto">
            <header className="mb-6">
              <h1 className="text-5xl font-black tracking-[0.1em] uppercase italic bg-gradient-to-r from-white via-cyan-400 to-blue-600 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(0,229,255,0.4)]">
                Neural Orbiter
              </h1>
              <p className="font-mono text-[10px] text-cyan-500/60 tracking-[0.3em] uppercase mt-1">
                Task Management // Synchronized
              </p>
            </header>
            <div className="bg-slate-950/80 border border-white/10 p-2 rounded-2xl shadow-2xl backdrop-blur-md">
              <TodoForm />
            </div>
          </div>

          <div className="w-full max-w-sm pointer-events-auto">
             <div className="flex flex-col gap-y-3 max-h-[40vh] overflow-y-auto pr-4 custom-scrollbar mb-4">
              {todos.map((todo) => (
                <TodoItem key={todo.id} todo={todo} />
              ))}
            </div>

            <button 
              onClick={cleanupSystem}
              className="w-full py-3 mb-4 rounded-xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 font-mono text-[10px] tracking-[0.3em] uppercase hover:bg-cyan-500 hover:text-black transition-all shadow-[0_0_20px_rgba(0,229,255,0.1)] active:scale-95"
            >
              Initialize Purge Sequence
            </button>
            
            <footer className="pt-4 border-t border-white/5 flex justify-between items-end font-mono text-[9px] tracking-[0.4em] uppercase">
              <div className={ripple ? "text-red-500" : "text-cyan-900"}>
                Status: {ripple ? "PROCESSING" : "RELAXED"}
              </div>
              <div className="text-white/10">Active Nodes: {todos.length}</div>
            </footer>
          </div>
        </div>
      </div>
    </TodoProvider>
  )
}

export default App