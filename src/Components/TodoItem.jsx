import React, { useState } from "react";
import { useTodo } from "../Contexts";

function TodoItem({ todo }) {
  const [isTodoEditable, setisTodoEditable] = useState(false);
  const [todoMsg, setTodoMsg] = useState(todo.todo);
  const { updateTodo, deleteTodo, toggleComplete } = useTodo();

  const editTodo = () => {
    updateTodo(todo.id, { todo: todoMsg });
    setisTodoEditable(false);
  };

  return (
    <div className={`todo-glass-card flex items-center px-5 gap-x-3 pointer-events-auto transition-all ${todo.completed ? "opacity-30 grayscale" : ""}`}>
      <label className="cyber-check-container">
        <input type="checkbox" checked={todo.completed} onChange={() => toggleComplete(todo.id)} />
        <span className="neural-check-visual"></span>
      </label>
      
      <input
        type="text"
        className={`outline-none w-full bg-transparent px-2 font-bold text-[15px] tracking-wide text-white ${isTodoEditable ? 'border-b border-cyan-500/50' : ''}`}
        value={todoMsg}
        onChange={(e) => setTodoMsg(e.target.value)}
        readOnly={!isTodoEditable}
      />

      <div className="flex gap-2 flex-shrink-0">
        <button
          className="btn-secondary px-4 py-1.5 rounded-lg text-[9px] font-black uppercase"
          onClick={() => isTodoEditable ? editTodo() : setisTodoEditable(true)}
        >
          {isTodoEditable ? "SAVE" : "EDIT"}
        </button>
        <button
          className="btn-danger px-4 py-1.5 rounded-lg text-[9px] font-black uppercase"
          onClick={() => deleteTodo(todo.id)}
        >
          DEL
        </button>
      </div>
    </div>
  );
}

export default TodoItem;