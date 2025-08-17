"use client"

import { useEffect, useState, useRef } from "react"
import { useNavigate, useLocation, Outlet } from "react-router-dom"
import { useAuth } from "../context/context"
import { useTask } from "../context/taskcontext"
import axios from "axios"
import "./admin-dashboard.css"
import "./admin-section/admin-section-css/scrolling-fix.css"

const Admindashboard = () => {
  const { user, logout, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const { tasks, fetchTasks, loading: taskLoading } = useTask()
  const [employeeCount, setEmployeeCount] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false) // ✅ Start with sidebar hidden
  const sidebarRef = useRef(null)
  const toggleRef = useRef(null)

  const fetchEmployeeCount = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await axios.get("https://oms-api-production-b8aa.up.railway.app/api/employees/count", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setEmployeeCount(res.data.count)
    } catch (err) {
      console.error("❌ Failed to fetch employee count:", err.message)
    }
  }

  // ✅ Handle clicks outside sidebar to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      // If sidebar is open and click is outside sidebar and toggle button
      if (
        sidebarOpen &&
        sidebarRef.current &&
        toggleRef.current &&
        !sidebarRef.current.contains(event.target) &&
        !toggleRef.current.contains(event.target)
      ) {
        setSidebarOpen(false)
      }
    }

    // Add event listener when sidebar is open
    if (sidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("touchstart", handleClickOutside)
    }

    // Cleanup event listeners
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("touchstart", handleClickOutside)
    }
  }, [sidebarOpen])

  // ✅ Close sidebar when route changes
  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  // ✅ Handle ESC key to close sidebar
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape" && sidebarOpen) {
        setSidebarOpen(false)
      }
    }

    document.addEventListener("keydown", handleEscKey)
    return () => document.removeEventListener("keydown", handleEscKey)
  }, [sidebarOpen])

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
  const isDashboard = location.pathname === "/admin-dashboard"

  // ✅ Handle sidebar toggle
  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen)
  }

  // ✅ Handle navigation and close sidebar
  const handleNavigation = (path) => {
    navigate(path)
    setSidebarOpen(false) // Close sidebar after navigation
  }

  // ✅ Handle logout and close sidebar
  const handleLogout = () => {
    setSidebarOpen(false)
    logout()
  }

  return (
    <div className="admin-dashboard">
      {/* Sidebar Toggle Button */}
      <button
        ref={toggleRef}
        className="sidebar-toggle"
        onClick={handleSidebarToggle}
        aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
        aria-expanded={sidebarOpen}
      >
        <div className="tog-c">
          <div className={`tog-l ${sidebarOpen ? "active" : ""}`}></div>
          <div className={`tog-l ${sidebarOpen ? "active" : ""}`}></div>
          <div className={`tog-l ${sidebarOpen ? "active" : ""}`}></div>
        </div>
      </button>

      {/* Sidebar */}
      <aside ref={sidebarRef} className={`sidebar ${sidebarOpen ? "open" : "hidden"}`} aria-hidden={!sidebarOpen}>
        <h2 className="logo">Admin Panel</h2>
        <ul className="nav-links">
          <li onClick={() => handleNavigation("/admin-dashboard")} className={isDashboard ? "active" : ""}>
            Dashboard
          </li>
          <li
            onClick={() => handleNavigation("/admin-dashboard/employees")}
            className={location.pathname === "/admin-dashboard/employees" ? "active" : ""}
          >
            Employees
          </li>
          <li
            onClick={() => handleNavigation("/admin-dashboard/task")}
            className={location.pathname === "/admin-dashboard/task" ? "active" : ""}
          >
            New Tasks
          </li>
          <li
            onClick={() => handleNavigation("/admin-dashboard/report")}
            className={location.pathname === "/admin-dashboard/report" ? "active" : ""}
          >
            Reports
          </li>
          <li
            onClick={() => handleNavigation("/admin-dashboard/leave-requests")}
            className={location.pathname === "/admin-dashboard/leave-requests" ? "active" : ""}
          >
            Leave
          </li>
          <li
            onClick={() => handleNavigation("/admin-dashboard/settings")}
            className={location.pathname === "/admin-dashboard/settings" ? "active" : ""}
          >
            Settings
          </li>
          <li onClick={handleLogout} className="logout">
            Logout
          </li>
        </ul>
      </aside>

      {/* Overlay for mobile when sidebar is open */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} aria-hidden="true" />}

      {/* Main Content */}
      <main
        className={`dashboard-content ${sidebarOpen ? "" : "expanded"}`}
        style={{
          height: "auto",
          maxHeight: "none",
          overflowY: "auto",
          minHeight: "auto",
        }}
      >
        {isDashboard ? (
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
              <div className="card task-1" onClick={() => handleNavigation("/admin-dashboard/task")}>
                <h3>Pending Tasks</h3>
                <p>{pendingTasks.length}</p>
              </div>
              <div className="card">
                <h3>Completed Tasks</h3>
                <p>{completedTasks.length}</p>
              </div>
            </section>
          </>
        ) : (
          <Outlet />
        )}
      </main>
    </div>
  )
}

export default Admindashboard
