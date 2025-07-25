import React, { useEffect } from "react";
import { useAuth } from "../../context/context";
import { useNavigate } from "react-router-dom";
import { useTask } from "../../context/taskcontext";
import axios from "axios";
import "./employee-section-css/timeline.css";

const Timeline = () => {
  const { user, loading } = useAuth();
  const { tasks, fetchTasks } = useTask();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!user || user.role !== "employee")) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  const markAsComplete = async (taskId) => {
    try {
      const token = localStorage.getItem("token");
await axios.put(`https://oms-api-production.up.railway.app/api/tasks/${taskId}/complete`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchTasks(); // Refresh task list
    } catch (err) {
      console.error("Failed to mark task complete", err.message);
    }
  };

  if (loading) return <p>Loading tasks...</p>;

  return (
    <div className="task-list-page">
      <button className="back-btn" onClick={() => navigate("/employee-dashboard")}>
        ← Back to Dashboard
      </button>

      <div className="header">
        <div>
          <h1>Employee <span>Task List</span></h1>
          <p>Q3 • 2025</p>
        </div>
        <img src="https://img.icons8.com/3d-fluency/94/task.png" alt="task" />
      </div>

      <table className="task-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Task</th>
            <th>Owner</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Deadline</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {tasks?.map((task, index) => (
            <tr key={task._id}>
              <td>{index + 1}</td>
              <td>{task.title}</td>
              <td>{user?.name || "You"}</td>
              <td className={`priority ${task.priority?.toLowerCase() || "low"}`}>
                {task.priority || "Low"}
              </td>
              <td>
                <span className={`status-dot ${task.status === "completed" ? "green" : task.status === "pending" ? "orange" : "red"}`} />
              </td>
              <td>{new Date(task.deadline || Date.now()).toLocaleDateString()}</td>
              <td>
                {task.status === "pending" && (
                  <button className="complete-btn" onClick={() => markAsComplete(task._id)}>
                    Mark as Complete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="notes">
        <h3>NOTES</h3>
        <ul>
          <li></li><li></li><li></li><li></li><li></li>
        </ul>
      </div>
    </div>
  );
};

export default Timeline;
