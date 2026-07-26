import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { addTodo, clearAll, completeTask, deleteTask, updateTask } from './todoSlice';

const Todo = () => {

    const [task, setTask] = useState("");
    const [description, setDescription] = useState("")

    const dispatch = useDispatch();
    const tasks = useSelector((state) => state.addTodo.tasks)
    const [editingId, setEditingId] = useState(null)


    const handleSubmit = (e) => {
        e.preventDefault();

        if (editingId) {

            const updatedTask = {
                id: editingId,
                task,
                description
            }

            dispatch(updateTask(updatedTask))

            setEditingId(null)

        } else {
            const newTask = {
                task,
                description
            }

            dispatch(addTodo(newTask));
        }

        setTask("")
        setDescription("")
    }

    const clear = () => {
        dispatch(clearAll())
    }

    const complete = (task) => {
        dispatch(completeTask(task))
    }

    const del = (task) => {
        dispatch(deleteTask(task))
    }

    const edit = (item) => {

        setEditingId(item.id)
        setTask(item.task)
        setDescription(item.description)

    }

    const update = () => {

        const updatedTask = {
            task,
            description
        }
        setIsEditing(false)
    }

    return (
        <>
        <h1 className="heading">Todo Using <i>Redux</i></h1>
            <hr />
            <div className="form">
                <form onSubmit={handleSubmit}>
                    <input type="text" name="task" placeholder="Enter task..." value={task} onChange={(e) => setTask(e.target.value)} required />
                    <input type="text" name="description" placeholder="Enter Task description" value={description} onChange={(e) => setDescription(e.target.value)} required />

                    <input type="submit" value={editingId ? "Update" : "Add Task"} className="add-update" />
                </form>
                <button onClick={clear} className="delete">Clear All Tasks</button>
            </div>


            <hr />
            <div className="tasks">

                {tasks.length === 0 ? (
                    <p>No tasks added yet.</p>
                ) : (
                    
                        tasks.map((item) => {
                            return (<div key={item.id} className="task-card">
                                <div>
                                    <h1 className={item.completed ? "completed" : ""}>{item.task}</h1>
                                    <p>{item.description}</p>
                                </div>
                                <div>
                                    {item.completed ? "completed" : (<button onClick={() => complete(item)} className="complete">Complete</button>)}

                                    <button onClick={() => edit(item)} style={{ display: item.completed ? "none" : "" }} className="edit">Edit</button>

                                    <button className='delete' onClick={() => del(item)}>
                                        Delete
                                    </button>
                                </div>
                            </div>)

                        })
                    
                )}
            </div>
        </>
    )
}

export default Todo;