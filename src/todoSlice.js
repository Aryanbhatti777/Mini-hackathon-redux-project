import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    tasks: JSON.parse(localStorage.getItem("task")) || []
}


export const todoSlice = createSlice({
    name: 'todo',
    initialState,
    reducers: {
        addTodo: (state, actions) => {
            state.tasks.push({
                id: Date.now(),
                task: actions.payload.task,
                description: actions.payload.description,
                completed: false
            })

            localStorage.setItem("task", JSON.stringify(state.tasks))
        },

        clearAll: (state) => {
            state.tasks = [];
            localStorage.removeItem("task")
        },

        completeTask: (state, action) => {
            const todo = state.tasks.find(
                item => item.id === action.payload.id
            );

            if (todo) {
                todo.completed = true;
            }

            localStorage.setItem("task", JSON.stringify(state.tasks));
        },

        deleteTask: (state, actions) => {
            state.tasks = state.tasks.filter(
                item => item.id !== actions.payload.id
            );

            localStorage.setItem("task", JSON.stringify(state.tasks));
        },

        updateTask : (state, actions) => {
            
            const todo = state.tasks.find((item) => item.id === actions.payload.id)

            if(todo){
                todo.task = actions.payload.task,
                todo.description = actions.payload.description
            }

            localStorage.setItem("task", JSON.stringify(state.tasks))
            
        }
    }
})

export const { addTodo, clearAll, completeTask, deleteTask, updateTask } = todoSlice.actions
export default todoSlice.reducer