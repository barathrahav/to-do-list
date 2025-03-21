import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Todolist.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { faFilePen } from "@fortawesome/free-solid-svg-icons";
import { faFileArrowDown } from "@fortawesome/free-solid-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

function Todo() {
  const [tasks, setTasks] = useState([]);
  const [inputTask, setInputTask] = useState("");
  const [editTask, setEditTask] = useState({ id: null, text: "" });

  useEffect(() => {
    axios
      .get("http://localhost:5000/getTasks")
      .then((response) => {
        setTasks(response.data);
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error);
      });
  }, []);

  const addTask = () => {
    if (inputTask) {
      axios
        .post("http://localhost:5000/addTask", { task: inputTask })
        .then((response) => {
          console.log("Task added:", response.data);

          axios
            .get("http://localhost:5000/getTasks")
            .then((response) => {
              console.log("Tasks fetched:", response.data);
              setTasks(response.data);
            })
            .catch((error) => {
              console.error("Error fetching tasks:", error);
            });
        })
        .catch((error) => {
          console.error("Error adding task:", error);
        });

      setInputTask("");
    }
  };

  const editTaskText = (task) => {
    setEditTask({ id: task._id, text: task.task });
  };

  const saveEditedTask = () => {
    if (editTask.id !== null) {
      axios
        .put(`http://localhost:5000/updateTask/${editTask.id}`, {
          task: editTask.text,
        })
        .then((response) => {
          console.log("Task updated:", response.data);

          axios
            .get("http://localhost:5000/getTasks")
            .then((response) => {
              console.log("Tasks fetched:", response.data);
              setTasks(response.data);
            })
            .catch((error) => {
              console.error("Error fetching tasks:", error);
            });
        })
        .catch((error) => {
          console.error("Error updating task:", error);
        });

      setEditTask({ id: null, text: "" });
    }
  };

  const removeTask = (taskId) => {
    axios
      .delete(`http://localhost:5000/deleteTask/${taskId}`)
      .then((response) => {
        console.log(response.data);

        axios
          .get("http://localhost:5000/getTasks")
          .then((response) => {
            setTasks(response.data);
          })
          .catch((error) => {
            console.error("Error fetching tasks:", error);
          });
      })
      .catch((error) => {
        console.error("Error removing task:", error);
      });
  };

  return (
    <div className="todobg ">
      <div className="todo-container">
        <h1 className="text-center fw-bold">To-Do List</h1>
        <div className="input-container">
          <input
            type="text"
            placeholder="Add a task..."
            value={inputTask}
            onChange={(e) => setInputTask(e.target.value)}
          />
          <button className="add-button ms-3" onClick={addTask}>
            <FontAwesomeIcon icon={faPlus} />
            &nbsp;Add
          </button>
        </div>
        <ul className="task-list">
          {tasks.map((task) => (
            <li
              key={task._id}
              className="task-item d-flex justify-content-between"
            >
              {editTask.id === task._id ? (
                <div className="edit-container">
                  <input
                    type="text"
                    value={editTask.text}
                    onChange={(e) =>
                      setEditTask({ id: task._id, text: e.target.value })
                    }
                  />
                  <button
                    className="save-button"
                    onClick={() => saveEditedTask()}
                  >
                    <FontAwesomeIcon icon={faFileArrowDown} />
                    &nbsp;Save
                  </button>
                </div>
              ) : (
                <span>{task.task}</span>
              )}
              <div>
                <button
                  className="edit-button me-3"
                  onClick={() => editTaskText(task)}
                >
                  <FontAwesomeIcon icon={faFilePen} />
                  &nbsp;Edit
                </button>
                <button
                  className="remove-button"
                  onClick={() => removeTask(task._id)}
                >
                  <FontAwesomeIcon icon={faTrashCan} />
                  &nbsp;Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Todo;
