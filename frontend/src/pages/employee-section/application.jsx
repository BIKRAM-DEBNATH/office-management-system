import React, { useState, useEffect } from "react";
import "./employee-section-css/application.css";
import axios from "axios";
import { useAuth } from "../../context/context";

const ApplicationToAdmin = () => {
  const { user, loading } = useAuth();
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [form, setForm] = useState({ reason: "", date: "" });

  useEffect(() => {
    if (!loading && user?.role === "employee") {
      fetchMyLeaves();
    }
  }, [user, loading]);

  const fetchMyLeaves = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/leaves", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const allLeaves = res.data.data || [];

      // ✅ FIXED: use user._id instead of user.id
      const employeeLeaves = allLeaves.filter(
        (req) =>
          req.employee?._id === user._id || req.employee === user._id
      );

      setLeaveRequests(employeeLeaves.reverse()); // most recent first
    } catch (err) {
      console.error("Error fetching leave requests:", err.message);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.reason || !form.date) return;

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/leaves", form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setForm({ reason: "", date: "" });
      fetchMyLeaves(); // refresh list
    } catch (err) {
      console.error("Error submitting leave request:", err.message);
    }
  };

  return (
    <div className="application-page">
      <h2>Apply for Leave</h2>
      <form className="leave-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="reason"
          placeholder="Leave Reason"
          value={form.reason}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
        />
        <button type="submit">Submit Request</button>
      </form>

      <h3>My Leave Requests</h3>
      <div className="leave-list">
        {leaveRequests.length === 0 ? (
          <p>No leave requests submitted yet.</p>
        ) : (
          leaveRequests.map((req) => (
            <div key={req._id} className={`leave-card ${req.status}`}>
              <p><strong>Reason:</strong> {req.reason}</p>
              <p><strong>Date:</strong> {new Date(req.date).toLocaleDateString()}</p>
              <p>
                <strong>Status:</strong>{" "}
                <span className={`status-text ${req.status}`}>
                  {req.status.toUpperCase()}
                </span>
              </p>
              {req.status === "rejected" && req.note && (
                <div className="rejection-note">
                  <strong>Note:</strong> {req.note}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ApplicationToAdmin;
