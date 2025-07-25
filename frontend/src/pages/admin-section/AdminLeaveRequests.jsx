import React, { useEffect, useState } from "react";
import "./admin-section-css/adminleave.css";
import axios from "axios";
import { useAuth } from "../../context/context";

const AdminLeaveRequests = () => {
  const [requests, setRequests] = useState([]);
  const { user, loading } = useAuth();

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/leaves", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setRequests(res.data.data);
      }
    } catch (err) {
      console.error("❌ Failed to fetch leave requests:", err);
    }
  };

  useEffect(() => {
    if (!loading && user?.role === "admin") {
      fetchRequests();
    }
  }, [user, loading]);

  const handleAction = async (id, action, note = "") => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/leaves/${id}`,
        { status: action, note },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchRequests(); // refresh data
    } catch (err) {
      console.error("❌ Error updating request:", err);
    }
  };

  return (
    <div className="admin-requests-page">
      <main className="admin-main-content">
        <h2>Leave Applications</h2>
        {requests.length === 0 ? (
          <p>No leave requests found.</p>
        ) : (
          <div className="request-list">
            {requests.map((req) => (
              <div className={`request-card ${req.status}`} key={req._id}>
                <p><strong>Employee:</strong> {req.employee?.name || req.employee?.email || "Unknown"}</p>
                <p><strong>Reason:</strong> {req.reason}</p>
                <p><strong>Date:</strong> {new Date(req.date).toLocaleDateString()}</p>
                <p><strong>Status:</strong> {req.status}</p>

                {req.status === "pending" && (
                  <div className="action-box">
                    <button onClick={() => handleAction(req._id, "approved")}>Approve</button>
                    <RejectForm id={req._id} onReject={handleAction} />
                  </div>
                )}

                {req.status === "rejected" && req.note && (
                  <div className="note-box">
                    <strong>Rejection Note:</strong>
                    <p>{req.note}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

const RejectForm = ({ id, onReject }) => {
  const [note, setNote] = useState("");

  return (
    <div className="reject-box">
      <input
        type="text"
        placeholder="Reason for rejection"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
      <button
        onClick={() => onReject(id, "rejected", note)}
        disabled={!note.trim()}
      >
        Reject
      </button>
    </div>
  );
};

export default AdminLeaveRequests;
