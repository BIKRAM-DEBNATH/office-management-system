// src/pages/admin-section/settings.jsx

import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/context";
import { useNavigate } from "react-router-dom";
import "./admin-section-css/settings.css";
import "./admin-section-css/scrolling-fix.css";


const Settings = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [settings, setSettings] = useState({
    theme: "light",
    fontSize: "16px",
    fontFamily: "Arial",
    primaryColor: "#4f46e5",
    sidebarVisible: true,
    darkMode: false,
    animations: true,
    notifications: true,
    pageTransition: true,
    borderRadius: "8px",
    shadow: true,
    layout: "default",
    showTooltips: true,
    fixedHeader: false,
    autoSave: true,
    compactMode: false,
    navIcons: true,
    roundedButtons: true,
    sidebarGradient: false,
    cardStyle: "elevated",
    maxContainerWidth: "1200px",
    buttonStyle: "solid",
    inputStyle: "rounded",
    hoverEffects: true,
    showAvatars: true,
    highlightActive: true,
    customCursor: false,
    accessibleMode: false,
    soundFeedback: false,
    language: "en",
    timeFormat: "24h"
  });

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1>Admin Layout Settings</h1>
        <button onClick={() => navigate("/admin-dashboard")} className="back-btn">
          ← Back to Dashboard
        </button>
      </div>

      <div className="settings-grid">
        {Object.keys(settings).map((key) => (
          <div className="setting-row" key={key}>
            <label htmlFor={key}>{key.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase())}</label>
            {typeof settings[key] === "boolean" ? (
              <button
                className={`toggle-btn ${settings[key] ? "active" : ""}`}
                onClick={() => handleChange({ target: { name: key, type: "checkbox", checked: !settings[key] } })}
              >
                {settings[key] ? "On" : "Off"}
              </button>
            ) : (
              <input
                type="text"
                name={key}
                value={settings[key]}
                onChange={handleChange}
                className="input-setting"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Settings;
