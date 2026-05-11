import React, { useState } from "react";
import { useTodo } from "../Contexts";

function TodoForm() {
  const [todo, setTodo] = useState("");
  const { addTodo, triggerRipple } = useTodo();

  const add = (e) => {
    e.preventDefault();
    if (!todo.trim()) return;

    addTodo({ todo, completed: false });
    if (triggerRipple) triggerRipple();
    setTodo("");
  };

  return (
    <form onSubmit={add} className="relative flex group w-full max-w-xl mx-auto">
      {/* Background Decorative Glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 blur-lg opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 rounded-2xl" />

      <div className="relative flex w-full items-center bg-black/60 backdrop-blur-xl p-1.5 rounded-2xl border border-white/10 group-focus-within:border-cyan-500/50 transition-all duration-300 gap-2">
        <input
          type="text"
          placeholder="INITIALIZE TASK..."
          className="min-w-0 flex-1 bg-transparent px-3 py-2 text-white placeholder:text-cyan-500/30 outline-none font-mono text-xs sm:text-sm tracking-wider"
          value={todo}
          onChange={(e) => setTodo(e.target.value)}
        />

        <button
          type="submit"
          className="relative flex-shrink-0 overflow-hidden rounded-xl px-5 sm:px-10 py-2.5 sm:py-3 bg-cyan-600 text-black font-black uppercase tracking-wider sm:tracking-[0.2em] text-xs sm:text-base transition-all duration-300 hover:bg-cyan-400 hover:shadow-[0_0_30px_rgba(0,255,255,0.6)] active:scale-95"
        >
          {/* Animated Shimmer Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
          
          <span className="relative z-10 block text-center">Deploy</span>
        </button>
      </div>
    </form>
  );
}

export default TodoForm;
