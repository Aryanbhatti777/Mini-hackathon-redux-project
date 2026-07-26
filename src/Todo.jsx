import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { addTodo, clearAll } from './todoSlice';

const Todo = () => {

    const [task, setTask] = useState("");
    const [description, setDescription] = useState("")

    const dispatch = useDispatch();
    const tasks = useSelector((state) => state.addTodo.tasks)


    const handleSubmit = (e) => {
        e.preventDefault();

        const newTask = {
            task,
            description
        }

        dispatch(addTodo(newTask));

        setTask("")
        setDescription("")
    }

    const clear = () => {
        dispatch(clearAll())
    }

    return (
        <>
        <h1 className="heading">Todo Using Redux</h1>
        <hr />
            <div className="form">
                <form onSubmit={handleSubmit}>
                    <input type="text" name="task" placeholder="Enter task..." value={task} onChange={(e) => setTask(e.target.value)} required/>
                    <input type="text" name="description" placeholder="Enter Task description" value={description} onChange={(e) => setDescription(e.target.value)} required/>
                    <input type="submit" value="Add Task" />
                </form>
                    <button onClick={clear}>Clear All Tasks</button>
            </div>

            
<hr />
            <div className="tasks">
                {tasks.map((item) => {
                    return(<div key={item.id} className="task-card">
                        <div>
                            <h1>{item.task}</h1>
                            <p>{item.description}</p>
                        </div>
                    </div>)

                })}

            </div>
        </>
    )
}

export default Todo;