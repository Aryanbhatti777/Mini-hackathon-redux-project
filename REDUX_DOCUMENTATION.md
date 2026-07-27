# Redux and Project Documentation

## What is Redux

Redux is an open-source JavaScript library used for managing and centralizing application state. It is commonly used with front-end frameworks like React or Angular for building user interfaces.

In a standard React application, state is usually managed locally inside individual components using hooks like useState or useReducer. When an application grows larger, multiple components often need access to the same state. Passing state down through many levels of nested components leads to complex, hard-to-maintain code. Redux solves this problem by providing a single central store that holds all application state. Any component in the app can read from or dispatch changes to this central store.

### Core Principles of Redux

Redux operates on three primary principles:

1. Single Source of Truth
The global state of the entire application is stored inside a single object tree within a single Redux store. This makes it easy to track changes, debug state issues, and persist or restore application data.

2. State is Read-Only
The only way to change the application state is to dispatch an action. An action is a plain JavaScript object that describes what happened in the application. Direct modification of the state object is not allowed.

3. Changes Are Made with Pure Functions
To specify how the state tree is updated based on actions, developers write pure functions called reducers. A reducer takes the current state and an action as arguments and returns the next state.

### Redux Toolkit

Traditionally, setting up Redux required writing boilerplate code, including action types, action creators, and complex reducer logic with manual object copying. Redux Toolkit (@reduxjs/toolkit) was created by the Redux team to standardize and simplify Redux development.

Redux Toolkit includes functions like configureStore and createSlice:
- configureStore simplifies store setup with good defaults, automatic integration of Redux DevTools, and middleware configuration.
- createSlice allows developers to define state, reducers, and action creators all in one place. It also uses Immer internally, which lets developers write code that looks like direct state mutation while keeping state updates strictly immutable under the hood.

## Why Redux is Used

Managing state locally inside React components works well for small applications, but as apps grow, several challenges arise that Redux helps solve:

### 1. Eliminating Prop Drilling
Prop drilling happens when data must be passed down through multiple layers of components that do not need the data themselves, just so a deeply nested child component can access it. Redux eliminates prop drilling because any component can connect directly to the global store using hooks like useSelector.

### 2. Centralized and Predictable State Management
When state is scattered across dozens of components, tracking down where a bug occurred or why a component rendered unexpectedly becomes difficult. Centralizing state in Redux makes the application state predictable. Every state update happens through explicitly dispatched actions handled by defined reducers.

### 3. Shared State Across Unrelated Components
When two components located in completely different parts of the component tree need access to the same data, sharing state in React without Redux requires lifting state up to a common ancestor. If that ancestor is near the root of the app, many unrelated components might re-render. Redux allows both components to access and update the shared state without lifting state up.

### 4. Persistence and Debugging
Because all state updates pass through a central hub, Redux makes it straightforward to add features like state persistence to browser local storage, action logging, and time-travel debugging using Redux DevTools.

## How Redux Works in General

The architecture of Redux follows a strict one-way data flow:

1. View (UI): The user interacts with a component in the user interface, such as clicking a button or submitting a form.
2. Dispatch Action: The component calls dispatch with an action object. The action object contains a type identifier and optional payload data.
3. Reducer Execution: The Redux store passes the current state and the action to the corresponding reducer function.
4. Store Update: The reducer calculates the new state and returns it to the store.
5. UI Re-render: Components subscribed to the store via useSelector detect the state change and re-render automatically with the updated data.

## Project Overview

This project is a React todo application built with Redux Toolkit for state management and Vite as the build tool. It provides full task management capabilities, including creating new tasks, viewing task lists, editing existing tasks, marking tasks complete, deleting tasks, and clearing all tasks at once. State is automatically saved to browser local storage so tasks remain intact after page refreshes.

### Key Features
- Create tasks with a title and a detailed description.
- Mark tasks as completed with visual strike-through styling.
- Edit existing tasks inline without losing task status.
- Delete individual tasks from the list.
- Clear all tasks with a single button click.
- Automatic local storage synchronization for persistent data.

### Technology Stack
- React 19: Front-end UI library.
- Redux Toolkit 2.12: Modern state management toolset.
- React-Redux 9.3: Official React bindings for Redux.
- Vite 8.1: Fast development server and build tool.

## Project File Structure

The project code is organized inside the src directory:

- package.json - Declares project dependencies and run scripts.
- index.html - Root HTML template for the Vite application.
- src/main.jsx - Entry point file that mounts the React application and wraps it in the Redux Provider.
- src/App.jsx - Root container component rendering the Todo UI component.
- src/Todo.jsx - Primary user interface component containing forms, task lists, and Redux dispatches.
- src/store.js - Configures and exports the central Redux store.
- src/todoSlice.js - Defines the Redux slice containing state, reducers, and exported action creators.
- src/index.css - Global CSS styles for application layout, buttons, and task cards.

## Detailed Implementation Breakdown

### 1. Store Configuration (`src/store.js`)

The store is created using configureStore from Redux Toolkit.

```javascript
import { configureStore } from "@reduxjs/toolkit";
import todoReducer from "./todoSlice.js";

const store = configureStore({
    reducer: {
        addTodo: todoReducer
    }
});

export default store;
```

Here, configureStore registers `todoReducer` under the state key `addTodo`. This means the state slice managed by this reducer is accessible in components via `state.addTodo`.

### 2. Todo Slice Definition (`src/todoSlice.js`)

The slice is created using createSlice from Redux Toolkit. It combines initial state, slice name, and reducer functions.

```javascript
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    tasks: JSON.parse(localStorage.getItem("task")) || []
};

export const todoSlice = createSlice({
    name: "todo",
    initialState,
    reducers: {
        addTodo: (state, actions) => {
            state.tasks.push({
                id: Date.now(),
                task: actions.payload.task,
                description: actions.payload.description,
                completed: false
            });
            localStorage.setItem("task", JSON.stringify(state.tasks));
        },
        clearAll: (state) => {
            state.tasks = [];
            localStorage.removeItem("task");
        },
        completeTask: (state, action) => {
            const todo = state.tasks.find(item => item.id === action.payload.id);
            if (todo) {
                todo.completed = true;
            }
            localStorage.setItem("task", JSON.stringify(state.tasks));
        },
        deleteTask: (state, actions) => {
            state.tasks = state.tasks.filter(item => item.id !== actions.payload.id);
            localStorage.setItem("task", JSON.stringify(state.tasks));
        },
        updateTask: (state, actions) => {
            const todo = state.tasks.find(item => item.id === actions.payload.id);
            if (todo) {
                todo.task = actions.payload.task;
                todo.description = actions.payload.description;
            }
            localStorage.setItem("task", JSON.stringify(state.tasks));
        }
    }
});

export const { addTodo, clearAll, completeTask, deleteTask, updateTask } = todoSlice.actions;
export default todoSlice.reducer;
```

Explanation of reducers in `todoSlice.js`:
- `addTodo`: Takes task title and description from action payload, generates a unique timestamp ID, creates a new task object, appends it to state.tasks, and writes the updated array to local storage.
- `completeTask`: Finds the task with matching ID and sets completed to true, then updates local storage.
- `updateTask`: Finds the task with matching ID and updates its task title and description fields, then updates local storage.
- `deleteTask`: Filters out the task matching the provided ID from state.tasks, then updates local storage.
- `clearAll`: Resets state.tasks to an empty array and removes the "task" key from local storage.

### 3. Connecting Redux to React (`src/main.jsx`)

To make the Redux store accessible to all React components, the App component is wrapped inside the Provider component from react-redux, passing the store as a prop.

```javascript
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import store from "./store.js";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
```

### 4. Interactive UI Component (`src/Todo.jsx`)

The Todo component connects to the Redux store using React-Redux hooks:
- `useSelector((state) => state.addTodo.tasks)` reads the current array of tasks from the Redux store.
- `useDispatch()` retrieves the dispatch function to send actions to the store.

Component state handles local form fields:
- `task`: Controlled input value for the task title.
- `description`: Controlled input value for the task description.
- `editingId`: Holds the ID of the task currently being edited. If null, submitting the form creates a new task. If set to an ID, submitting updates the existing task.

#### Workflow inside Todo.jsx:
- When a user clicks Edit on a task, `edit(item)` populates local input state with that task details and sets `editingId` to the task ID.
- When the form is submitted, `handleSubmit` checks `editingId`. If active, it dispatches `updateTask` with the updated ID, title, and description. Otherwise, it dispatches `addTodo`.
- Buttons for Complete, Delete, and Clear All dispatch `completeTask`, `deleteTask`, and `clearAll` respectively.

### 5. Styling and User Interface (`src/index.css`)

The app uses dark-themed custom CSS:
- Dark background with centered layout and soft typography.
- Color-coded action buttons: red for delete, yellow for edit, green for complete, cyan for add/update.
- Completed tasks feature grey text with line-through text decoration.
- Completed task cards automatically hide the edit button and replace the complete button with a static "completed" label.

## Local Storage Persistence Logic

Persistence is managed directly inside the Redux slice:
1. Reading Data: When the app loads, `initialState` evaluates `JSON.parse(localStorage.getItem("task")) || []`. If saved JSON exists under key "task", it is parsed into state.tasks. Otherwise, it defaults to an empty array.
2. Saving Data: Every reducer function that modifies `state.tasks` immediately executes `localStorage.setItem("task", JSON.stringify(state.tasks))`.
3. Clearing Data: The `clearAll` reducer calls `localStorage.removeItem("task")`.

## Data Flow Examples

### Adding a New Task
1. User types "Buy groceries" and "Milk, eggs, bread" into the inputs and submits the form.
2. `handleSubmit` prevents default browser refresh and calls `dispatch(addTodo({ task: "Buy groceries", description: "Milk, eggs, bread" }))`.
3. The `addTodo` reducer executes, creates `{ id: 1711000000000, task: "Buy groceries", description: "Milk, eggs, bread", completed: false }`, pushes it to `state.tasks`, and saves to local storage.
4. `useSelector` detects the state change and re-renders `Todo.jsx`, rendering the new task card on screen.

### Editing a Task
1. User clicks the "Edit" button on a task.
2. `edit(item)` sets local form states `task` and `description` to the task current values and sets `editingId` to the task ID.
3. User modifies the text and submits the form.
4. `handleSubmit` detects `editingId` is not null and dispatches `updateTask({ id: editingId, task, description })`.
5. The `updateTask` reducer finds the matching task in `state.tasks`, updates its properties, saves to local storage, and resets `editingId` to null.
6. The updated task appears on the UI.

## How to Run the Application

1. Open terminal in the project directory.
2. Install project dependencies:
   npm install

3. Run the Vite development server:
   npm run dev

4. Open the browser URL shown in the terminal (usually http://localhost:5173).

5. To create a production build:
   npm run build
