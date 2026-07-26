import { configureStore } from "@reduxjs/toolkit";
import todoReducer from "./todoSlice.js"

const store = configureStore({
    reducer: {
        addTodo: todoReducer
    }
})

export default store;