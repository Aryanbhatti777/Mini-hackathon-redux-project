import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    tasks : JSON.parse(localStorage.getItem("task")) || []
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
            localStorage.clear()
        } 
    }
})

export const { addTodo, clearAll } = todoSlice.actions
export default todoSlice.reducer