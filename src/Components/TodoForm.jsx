import React, { useState } from 'react'
import { useTodo } from '../Contexts'

function TodoForm() {
    const [todo, setTodo] = useState("")
    const { addTodo, triggerRipple } = useTodo()

    const add = (e) => {
        e.preventDefault()
        if (!todo.trim()) return

        // Adds todo with 3D data for the orbit
        addTodo({ 
            todo, 
            completed: false,
            angle: Math.random() * Math.PI * 2,
            radius: 3.5 + Math.random() * 1.5, 
            speed: 0.003 + Math.random() * 0.005,
            zOffset: (Math.random() - 0.5) * 2
        })
        
        if (triggerRipple) triggerRipple()
        setTodo("")
    }

    return (
        <form onSubmit={add} className="todo-input-form flex items-center gap-3 p-2 rounded-2xl transition-all">
            <input
                type="text"
                placeholder="INITIALIZE TASK..."
                className="w-full bg-transparent outline-none text-white px-4 py-3 font-mono text-[14px] font-bold tracking-widest placeholder:text-white/20"
                value={todo}
                onChange={(e) => setTodo(e.target.value)}
            />
            <button type="submit" className="deploy-btn px-10 py-3 rounded-xl text-[11px] flex-shrink-0">
                DEPLOY
            </button>
        </form>
    );
}

export default TodoForm;