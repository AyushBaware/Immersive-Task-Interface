import { createContext, useContext } from "react";

export const TodoContext = createContext({
    todos: [
        {
            id: 1,
            todo: "Todo msg ",
            completed: false,
        }
    ],
    ripple: false,
    addTodo : () => {},         // Removed unused 'todo' param
    updateTodo : () => {},      // Removed unused 'id, todo' params
    deleteTodo : () => {},      // Removed unused 'id' param
    toggleComplete : () => {},  // Removed unused 'id' param
    triggerRipple: () => {}
})

export const useTodo = () => {
    return useContext(TodoContext)
} 

export const TodoProvider = TodoContext.Provider