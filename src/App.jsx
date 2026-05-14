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
  const [isReady, setIsReady] = useState(false)

  // 🔷 LOADING GATE: Only set ready when Scene signals it's initialized
  const handleSceneReady = useCallback(() => {
    console.log('[Scene] Ready signal received, showing UI');
    setIsReady(true);
    window.dispatchEvent(new CustomEvent('scene-ready'));
  }, []);

  useEffect(() => {
    const fallbackTimer = setTimeout(() => {
      if (!isReady) {
        console.warn('[Fallback] Scene ready timeout exceeded, forcing UI visibility');
        setIsReady(true);
      }
    }, 8000);

    return () => clearTimeout(fallbackTimer);
  }, [isReady]);

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
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, ...updatedTodo } : t)))
  }

  const deleteTodo = (id) => {
    triggerRipple();
    setTodos((prev) => prev.filter((t) => t.id !== id))
  }

  const toggleComplete = (id) => {
    setTodos((prev) => prev.map((t) => t.id === id ? { ...t, completed: !t.completed } : t))
    triggerRipple();
  }

  const cleanupSystem = () => {
    if (!todos.some(t => t.completed)) return;
    triggerRipple();
    setTimeout(() => setTodos(prev => prev.filter(t => !t.completed)), 800);
  }

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos))
  }, [todos])

  return (
    <TodoProvider value={{ todos, addTodo, updateTodo, deleteTodo, toggleComplete, ripple, triggerRipple }}>
      <div className={`relative h-screen w-full bg-[#010208] overflow-hidden transition-opacity duration-700 ${isReady ? 'opacity-100' : 'opacity-0'}`}>
        
        <div className="fixed inset-0 z-0"><Scene onReady={handleSceneReady} /></div>

        <div className="relative z-10 h-full w-full flex flex-col p-6 sm:p-12 main-content-layout pointer-events-none">
          
          <div className="w-full max-w-md pointer-events-auto branding-container">
            <header className="mb-8">
              <h1 className="neural-title">Neural Orbiter</h1>
              <p className="font-mono text-[9px] text-cyan-400/50 tracking-[0.4em] uppercase mt-2">
                Task Management // Synchronized
              </p>
            </header>
            <TodoForm />
          </div>

          <div className="list-flex-grower flex-1 flex flex-col justify-end w-full max-w-[440px] mt-8">
            <div className="todo-list-container custom-scrollbar overflow-y-auto max-h-[38vh] pointer-events-auto pr-2">
              <div className="flex flex-col gap-3 py-4">
                {todos.map((todo) => (
                  <TodoItem key={todo.id} todo={todo} />
                ))}
              </div>
            </div>

            <div className="action-footer pointer-events-auto pt-4 w-full">
              <button onClick={cleanupSystem} className="sync-btn-container w-full py-4 text-cyan-400 text-[10px] tracking-[0.4em] uppercase rounded-xl">
                Synchronize Core
              </button>
              
              <div className="pt-5 mt-4 border-t border-white/5 flex justify-between px-1">
                <div className="dash-label">
                  STATUS: <span className={ripple ? "text-red-500" : "text-cyan-400 ml-2"}>
                    {ripple ? "SYNCING" : "RELAXED"}
                  </span>
                </div>
                <div className="dash-label">
                  ACTIVE NODES: <span className="text-white ml-2">{todos.length}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </TodoProvider>
  )
}

export default App