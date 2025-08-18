import { useState } from "react";
import "./employee-section-css/news.css"

export default function CompanyNews() {
  const [news, setNews] = useState([
    {
      id: 1,
      title: "🎉 Office Management System Launched",
      content: "We are excited to announce the launch of our new OMS platform!",
      date: "2025-08-15",
    },
    {
      id: 2,
      title: "📢 Holiday Notice",
      content:
        "The office will remain closed on 19th August for Independence Day celebrations.",
      date: "2025-08-17",
    },
  ]);

  const containerStyle = {
    maxWidth: "700px",
    margin: "20px auto",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  };

  const headingStyle = {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "15px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    color: "#333",
  };

  const newsCardStyle = {
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    borderLeft: "5px solid #007BFF",
    borderRadius: "8px",
    padding: "15px",
    marginBottom: "15px",
    boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
  };

  const titleStyle = {
    fontSize: "18px",
    fontWeight: "600",
    marginBottom: "5px",
  };

  const contentStyle = {
    fontSize: "14px",
    color: "#555",
    marginBottom: "8px",
  };

  const dateStyle = {
    fontSize: "12px",
    color: "#888",
  };

  const buttonStyle = {
    marginTop: "15px",
    padding: "10px 15px",
    backgroundColor: "#007BFF",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
  };

  return (
    <div style={containerStyle}>
      {/* Heading */}
      <h2 style={headingStyle}>
        <span>📢</span> Company News
      </h2>

      {/* News list */}
      <div>
        {news.map((item) => (
          <div key={item.id} style={newsCardStyle}>
            <h3 style={titleStyle}>{item.title}</h3>
            <p style={contentStyle}>{item.content}</p>
            <span style={dateStyle}>
              {new Date(item.date).toDateString()}
            </span>
          </div>
        ))}
      </div>

      {/* Add button */}
      <button
        style={buttonStyle}
        onClick={() =>
          setNews([
            ...news,
            {
              id: news.length + 1,
              title: "🚀 New Feature Released",
              content:
                "Task automation has been added to OMS. Check it out!",
              date: new Date().toISOString(),
            },
          ])
        }
      >
        Add Sample News
      </button>
    </div>
  );
}
