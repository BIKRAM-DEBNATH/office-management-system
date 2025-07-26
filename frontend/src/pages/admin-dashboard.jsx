"use client"

import { useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/context"
import { useTask } from "../context/taskcontext"
import axios from "axios"
import "./admin-dashboard.css"
import "./admin-section/admin-section-css/scrolling-fix.css"
import "./admin-dashboard-fix.css"

const Admindashboard = () => {
  const { user, logout, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const { tasks, fetchTasks, loading: taskLoading } = useTask()
  const [employeeCount, setEmployeeCount] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const fetchEmployeeCount = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await axios.get("https://oms-api-production.up.railway.app/api/employees/count", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setEmployeeCount(res.data.count)
    } catch (err) {
      console.error("❌ Failed to fetch employee count:", err.message)
    }
  }

  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== "admin") {
        navigate("/login")
      } else {
        fetchEmployeeCount()
        fetchTasks(true)
      }
    }
  }, [user, loading])

  if (loading || taskLoading) return <p>🔐 Checking access...</p>

  const pendingTasks = tasks?.filter((task) => task.status === "pending") || []
  const completedTasks = tasks?.filter((task) => task.status === "completed") || []

  return (
    <div className="admin-dashboard">
      <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
        <div className="tog-c">
          <div className="tog-l"></div>
          <div className="tog-l"></div>
          <div className="tog-l"></div>
        </div>
      </button>

      <aside className={`sidebar ${sidebarOpen ? "" : "hidden"}`}>
        <h2 className="logo">Admin Panel</h2>
        <ul className="nav-links">
          <li onClick={() => navigate("/admin-dashboard")}>Dashboard</li>
          <li onClick={() => navigate("/admin-dashboard/employees")}>Employees</li>
          <li onClick={() => navigate("/admin-dashboard/task")}>New Tasks</li>
          <li onClick={() => navigate("/admin-dashboard/report")}>Reports</li>
          <li onClick={() => navigate("/admin-dashboard/leave-requests")}>Leave</li>
          <li onClick={() => navigate("/admin-dashboard/settings")}>Settings</li>
          <li onClick={logout} className="logout">
            Logout
          </li>
        </ul>
      </aside>

      <main
        className={`dashboard-content ${sidebarOpen ? "" : "expanded"}`}
        style={{
          height: "auto",
          maxHeight: "none",
          overflowY: "auto",
          minHeight: "auto",
        }}
      >
        {location.pathname === "/admin-dashboard" && (
          <>
            <header className="dashboard-header">
              <h1>Welcome, {user?.name || "Admin"}</h1>
              <p>Role: {user?.role}</p>
            </header>
            <section className="stats-cards">
              <div className="card">
                <h3>Total Employees</h3>
                <p>{employeeCount !== null ? employeeCount : "Loading..."}</p>
              </div>
              <div className="card task-1" onClick={() => navigate("/admin-dashboard/task")}>
                <h3>Pending Tasks</h3>
                <p>{pendingTasks.length}</p>
              </div>
              <div className="card">
                <h3>Completed Tasks</h3>
                <p>{completedTasks.length}</p>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  )
}

export default Admindashboard
