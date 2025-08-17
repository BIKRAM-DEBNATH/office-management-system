import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const LeaveContext = createContext();

// ✅ Central API base URL
const API = "https://oms-api-l5st.onrender.com";

export const LeaveProvider = ({ children }) => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaves = async (token) => {
    try {
      const res = await axios.get(`${API}/api/leaves`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLeaves(res.data);
    } catch (err) {
      console.error("Error fetching leaves:", err);
    } finally {
      setLoading(false);
    }
  };

  const applyLeave = async (form, token) => {
    try {
      const res = await axios.post(`${API}/api/leaves`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLeaves((prev) => [res.data, ...prev]);
    } catch (err) {
      console.error("Apply leave error:", err);
    }
  };

  const updateLeaveStatus = async (id, status, note, token) => {
    try {
      const res = await axios.put(`${API}/api/leaves/${id}`, { status, note }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLeaves((prev) =>
        prev.map((l) => (l._id === id ? { ...l, status: res.data.status } : l))
      );
    } catch (err) {
      console.error("Update leave status error:", err);
    }
  };

  return (
    <LeaveContext.Provider
      value={{
        leaves,
        loading,
        fetchLeaves,
        applyLeave,
        updateLeaveStatus,
      }}
    >
      {children}
    </LeaveContext.Provider>
  );
};

export const useLeave = () => useContext(LeaveContext);
