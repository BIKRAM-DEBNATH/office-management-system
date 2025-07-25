import React, { useState, useEffect } from "react";
import "./employeedashboard.css";
import { useAuth } from "../context/context";
import { useNavigate } from "react-router-dom";
import { useTask } from "../context/taskcontext";

const Dashboard = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const { logout, user, loading } = useAuth();
  const navigate = useNavigate();
  const { tasks, fetchTasks } = useTask();

  useEffect(() => {
    if (user?.role === "employee") {
      fetchTasks();
    }
  }, [user, fetchTasks]);

  useEffect(() => {
    if (!loading && (!user || user.role !== "employee")) {
      navigate("/login");
    }
  }, [loading, user, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleSidebar = () => {
    setShowSidebar((prev) => !prev);
  };

  const completedTasks = tasks.filter((task) => task.status === "completed").length;
  const incompletedTasks = tasks.filter((task) => task.status === "pending").length;
  const totalTasks = tasks.length;
  const taskCompletionPercent = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className={`sidebar ${showSidebar ? "visible" : "hidden"}`}>
        <div className="logo">EWS</div>
        <nav className="menu">
          <div className="menu-section">Application</div>
          <a className="menu-item active">Overview</a>
          <a className="menu-item" onClick={() => navigate("/employee-dashboard/timeline")}>
            Timeline
          </a>
          <a className="menu-item" onClick={() => navigate("/employee-dashboard/application")}>
            Application to Admin
          </a>
          <a className="menu-item" onClick={() => navigate("/employee-dashboard/company-news")}>
            Company News
          </a>
          <a className="menu-item" onClick={() => navigate("/employee-dashboard/submit-work")}>
            Submit Work
          </a>
          <div className="menu-section">Account</div>
          <a className="menu-item" onClick={handleLogout}>Logout</a>
        </nav>
      </aside>

      {/* Toggle Button */}
      <button className="tog" onClick={toggleSidebar}>
        <div className="tog-c">
          <div className="tog-l"></div>
          <div className="tog-l"></div>
          <div className="tog-l"></div>
        </div>
      </button>

      {/* Main Content */}
      <main className="main-content">
        <header className="dashboard-header">
          <h1>Employee Dashboard</h1>
          <button className="add-task-btn" onClick={handleLogout}>Logout</button>
        </header>

        <section className="stats-cards">
          <div className="card">
            <div className="card-icon icon-1" />
            <h3>Total Tasks</h3>
            <p className="count">{totalTasks}</p>
            <p className="subtext">Assigned to you</p>
            <p className="growth">+12% This Month</p>
          </div>

          <div className="card">
            <div className="card-icon icon-2" />
            <h3>Completed Tasks</h3>
            <p className="count">{completedTasks}</p>
            <p className="subtext">Tasks you've done</p>
            <p className="growth">+18% Improvement</p>
          </div>

          <div className="card">
            <div className="card-icon icon-3" />
            <h3>Pending Tasks</h3>
            <p className="count">{incompletedTasks}</p>
            <p className="subtext">Tasks remaining</p>
            <p className="growth">-5% Drop</p>
          </div>

          <div className="card task-target">
            <h3>Task Completion</h3>
            <div className="circle-chart">
              <svg viewBox="0 0 36 36" className="circular-chart green">
                <path
                  className="circle-bg"
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="circle"
                  strokeDasharray={`${taskCompletionPercent}, 100`}
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <text x="18" y="20.35" className="percentage">
                  {taskCompletionPercent}%
                </text>
              </svg>
              <p className="tasks-number">{totalTasks} Tasks</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
