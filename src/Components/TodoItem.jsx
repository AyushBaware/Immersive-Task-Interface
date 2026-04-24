import React, { useState } from "react";
import { useTodo } from "../Contexts";

function TodoItem({ todo }) {
  const [isTodoEditable, setisTodoEditable] = useState(false);
  const [todoMsg, setTodoMsg] = useState(todo.todo);
  const { updateTodo, deleteTodo, toggleComplete } = useTodo();

  const editTodo = () => {
    updateTodo(todo.id, { ...todo, todo: todoMsg });
    setisTodoEditable(false);
  };

  return (
    <div
      className={`flex items-center border px-4 py-3 gap-x-3 backdrop-blur-xl transition-all duration-500 rounded-xl
      ${todo.completed 
        ? "border-green-500/40 bg-green-500/5 shadow-[0_0_20px_rgba(34,197,94,0.1)]" 
        : "border-white/10 bg-slate-950/40 hover:border-cyan-500/50"}`}
    >
      <input
        type="checkbox"
        className="cyber-check"
        checked={todo.completed}
        onChange={() => toggleComplete(todo.id)}
      />
      
      <input
        type="text"
        className={`outline-none w-full bg-transparent px-2 font-medium transition-all
        ${isTodoEditable ? 'text-cyan-400 border-b border-cyan-500/50' : 'text-white'} 
        ${todo.completed ? 'line-through opacity-40' : ''}`}
        value={todoMsg}
        onChange={(e) => setTodoMsg(e.target.value)}
        readOnly={!isTodoEditable}
      />

      <button
        className="p-2 rounded-lg border border-white/10 text-xs font-bold uppercase tracking-tighter hover:bg-cyan-500 hover:text-black transition-colors disabled:opacity-20"
        onClick={() => {
          if (todo.completed) return;
          if (isTodoEditable) editTodo();
          else setisTodoEditable(true);
        }}
        disabled={todo.completed}
      >
        {isTodoEditable ? "SAVE" : "EDIT"}
      </button>

      <button
        className="p-2 rounded-lg border border-red-500/30 text-red-500 text-xs font-bold hover:bg-red-500 hover:text-white transition-all"
        onClick={() => deleteTodo(todo.id)}
      >
        DEL
      </button>
    </div>
  );
}

export default TodoItem;