import React, { useState } from 'react'
import { useTodo } from '../Contexts'

function TodoForm() {
    const [todo, setTodo] = useState("")
    const { addTodo, triggerRipple } = useTodo()
    
    const add = (e) => {
        e.preventDefault()
        if (!todo) return

        addTodo({todo, completed: false})
        if(triggerRipple) triggerRipple() // Start the 3D wave!
        setTodo("") 
    }

    return (
        <form onSubmit={add} className="flex gap-2">
            <input
                type="text"
                placeholder="Write Todo..."
                className="w-full border border-white/10 rounded-xl px-4 outline-none duration-150 bg-white/10 text-white py-2 focus:bg-white/20"
                value={todo}
                onChange={(e) => setTodo(e.target.value)}
            />
            <button type="submit" className="rounded-xl px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all shrink-0">
                Add
            </button>
        </form>
    );
}

export default TodoForm;