import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = async (isAdmin = false) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }
const endpoint = isAdmin
 ? "https://oms-api-production-b8aa.up.railway.app/api/tasks"           // all tasks for admin
  : "https://oms-api-production-b8aa.up.railway.app/api/tasks/employee"; // only employee's tasks

      const res = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTasks(res.data || []);
    } catch (err) {
      console.error("Task fetch error:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TaskContext.Provider value={{ tasks, setTasks, fetchTasks, loading, error }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTask = () => useContext(TaskContext);
