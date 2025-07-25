import { Routes, Route, Navigate } from "react-router-dom";

// Auth
import Login from "./pages/login.jsx";

// Admin Layout
import Admindashboard from "./pages/admin-dashboard.jsx";

// Admin Sub-pages (nested inside admin layout)
import TaskManager from "./pages/admin-section/task.jsx";
import Report from "./pages/admin-section/report.jsx";
import Settings from "./pages/admin-section/settings.jsx";
import AdminLeaveRequests from "./pages/admin-section/AdminLeaveRequests.jsx";
import AdminEmployees from "./pages/admin-employee.jsx";

// Employee
import Dashboard from "./pages/Employeedashboard.jsx";
import Timeline from "./pages/employee-section/timeline.jsx";
import ApplicationToAdmin from "./pages/employee-section/application.jsx";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />

      {/* ✅ Admin layout with nested pages */}
      <Route path="/admin-dashboard" element={<Admindashboard />}>
        <Route index element={
          // Optional: a default dashboard inside layout
          <div style={{ padding: '2rem', fontSize: '1.2rem' }}>
            Select a section from the sidebar.
          </div>
        } />
        <Route path="task" element={<TaskManager />} />
        <Route path="report" element={<Report />} />
        <Route path="settings" element={<Settings />} />
        <Route path="leave-requests" element={<AdminLeaveRequests />} />
        <Route path="employees" element={<AdminEmployees />} />
      </Route>

      {/* Employee routes */}
      <Route path="/employee-dashboard" element={<Dashboard />} />
      <Route path="/employee-dashboard/timeline" element={<Timeline />} />
      <Route path="/employee-dashboard/application" element={<ApplicationToAdmin />} />
    </Routes>
  );
};

export default App;
