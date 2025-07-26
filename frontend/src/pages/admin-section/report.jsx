import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../context/context";
import './admin-section-css/report.css';
import "./admin-section-css/scrolling-fix.css";


const Report = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const [reportData, setReportData] = useState([]);
  const [reportType, setReportType] = useState('all');
  const [search, setSearch] = useState('');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      navigate('/login');
    }

    const dummyData = [
      { id: 1, employee: 'Rohan', task: 'Fix UI bug', status: 'Completed', date: '2025-07-10' },
      { id: 2, employee: 'Ranita', task: 'API Integration', status: 'Pending', date: '2025-07-13' },
      { id: 3, employee: 'Shreya', task: 'Testing', status: 'Completed', date: '2025-07-14' },
    ];
    setReportData(dummyData);
    setFilteredData(dummyData);
  }, [user, loading, navigate]);

  useEffect(() => {
    let data = reportData;

    if (reportType !== 'all') {
      data = data.filter(d => d.status.toLowerCase() === reportType);
    }

    if (search) {
      data = data.filter(d =>
        d.employee.toLowerCase().includes(search.toLowerCase()) ||
        d.task.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (dateRange.from && dateRange.to) {
      data = data.filter(d => d.date >= dateRange.from && d.date <= dateRange.to);
    }

    setFilteredData(data);
  }, [reportType, search, dateRange, reportData]);

  const handleDownload = () => {
    alert('Download initiated!');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="report-page">
      <header className="report-header">
        <h1>Admin Report</h1>
        <div className="report-buttons">
          <button className="btn back" onClick={() => navigate('/admin-dashboard')}>← Back to Dashboard</button>
          <button className="btn download" onClick={handleDownload}>⬇ Download</button>
          <button className="btn print" onClick={handlePrint}>🖨 Print</button>
        </div>
      </header>

      <div className="filters">
        <input type="date" value={dateRange.from} onChange={e => setDateRange({ ...dateRange, from: e.target.value })} />
        <input type="date" value={dateRange.to} onChange={e => setDateRange({ ...dateRange, to: e.target.value })} />

        <select value={reportType} onChange={e => setReportType(e.target.value)}>
          <option value="all">All Status</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
        </select>

        <input
          type="text"
          placeholder="Search by employee/task"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="report-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Employee</th>
              <th>Task</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length ? filteredData.map((task) => (
              <tr key={task.id}>
                <td>{task.id}</td>
                <td>{task.employee}</td>
                <td>{task.task}</td>
                <td>{task.status}</td>
                <td>{task.date}</td>
              </tr>
            )) : (
              <tr><td colSpan="5">No results found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Report;
