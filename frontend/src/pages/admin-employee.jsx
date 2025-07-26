import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/context';
import './admin-employees.css';
import "./admin-section/admin-section-css/scrolling-fix.css";


const AdminEmployees = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    password: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const BASE_URL = 'https://oms-api-production.up.railway.app/api/employees';

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      navigate('/login');
    } else if (user?.role === 'admin') {
      fetchEmployees();
    }
  }, [user, loading]);

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(BASE_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployees(res.data);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      if (editingId) {
        await axios.put(`${BASE_URL}/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(BASE_URL, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setFormData({ name: '', email: '', role: '', password: '' });
      setEditingId(null);
      fetchEmployees();
      setShowForm(false);
    } catch (err) {
      console.error('Submit error:', err);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`${BASE_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchEmployees();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleEdit = (emp) => {
    setFormData({ name: emp.name, email: emp.email, role: emp.role, password: '' });
    setEditingId(emp._id);
    setShowForm(true);
  };

  return (
    <div className="admin-employee-container">
      <h2>Manage Employees</h2>

      <button className="toggle-btn" onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Cancel' : editingId ? 'Edit Employee' : 'Add New Employee'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="employee-form">
          <input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required={!editingId}
          />
          <select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            required
          >
            <option value="">Select Role</option>
            <option value="employee">Employee</option>
            <option value="admin">Admin</option>
          </select>
          <button type="submit">{editingId ? 'Update' : 'Add'} Employee</button>
        </form>
      )}

      <ul className="employee-list">
        {employees.map((emp) => (
          <li key={emp._id}>
            <div className="employee-info">
              <strong>{emp.name}</strong>
              <span>{emp.email}</span>
              <span className="role-tag">{emp.role}</span>
            </div>
            <div className="employee-actions">
              <button className="edit-btn" onClick={() => handleEdit(emp)}>Edit</button>
              <button className="delete-btn" onClick={() => handleDelete(emp._id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminEmployees;
