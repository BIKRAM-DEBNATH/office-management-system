import React, { useEffect, useState } from 'react';
import './admin-section-css/task.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../context/context";
import { useTask } from "../../context/taskcontext";
import axios from "axios";
import "./admin-section-css/scrolling-fix.css";


const TaskManager = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { tasks, fetchTasks } = useTask();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      navigate('/login');
    } else if (user?.role === 'admin') {
      fetchTasks(true); // fetch with admin privileges
      fetchEmployees();
    }
  }, [user, loading]);

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem("token");
const res = await axios.get("https://oms-api-production-b8aa.up.railway.app/api/employees", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployees(res.data);
    } catch (err) {
      console.error("Failed to fetch employees", err.message);
    }
  };

  const handleAddTask = async () => {
    try {
      const token = localStorage.getItem("token");
const res = await axios.get("https://oms-api-production-b8aa.up.railway.app/api/tasks", {
        title,
        description,
        assignedTo,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setTitle('');
      setDescription('');
      setAssignedTo('');
      await fetchTasks(true); // refresh task list after adding
    } catch (err) {
      console.error("Failed to add task", err.message);
    }
  };

  return (
    <div className="task-page">
      <h1>Task Manager</h1>

      <button className="back" onClick={() => navigate('/admin-dashboard')}>
        ← Back to Dashboard
      </button>

      <div className="task-container">
        <div className="task-controls">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
          <select value={assignedTo} onChange={e => setAssignedTo(e.target.value)}>
            <option value="">Assign to</option>
            {employees.map(emp => (
              <option key={emp._id} value={emp._id}>{emp.name}</option>
            ))}
          </select>
          <button className='task-add' onClick={handleAddTask}>Add Task</button>
        </div>

        <div className="review">
          {Array.isArray(tasks) && tasks.length === 0 ? (
            <p>No tasks assigned yet.</p>
          ) : (
            tasks.map(task => (
              <div key={task._id} className={`task-card ${task.status}`}>
                <h3>{task.title}</h3>
                <p>{task.description}</p>
                <p>
                  Assigned To: {task.assignedTo?.name || task.assignedTo || "Unknown"}
                </p>
                <p>Status: <strong>{task.status}</strong></p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskManager;
