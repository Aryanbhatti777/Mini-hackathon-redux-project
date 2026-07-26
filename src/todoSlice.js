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
                task: actions.payload.task,
                description: actions.payload.description,
                completed: false
            })

            localStorage.setItem("task", JSON.stringify(state.tasks))
        }
    }
})

export const { addTodo } = todoSlice.actions
export default todoSlice.reducer