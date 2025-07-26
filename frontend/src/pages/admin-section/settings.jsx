"use client"

import { useEffect, useState } from "react"
import { useAuth } from "../../context/context"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import "./admin-section-css/settings.css"
import "./admin-section-css/scrolling-fix.css"

const Settings = () => {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })
  const [hasChanges, setHasChanges] = useState(false)

  const [settings, setSettings] = useState({
    // Appearance Settings
    theme: "dark",
    fontSize: "16px",
    fontFamily: "Inter",
    primaryColor: "#667eea",
    secondaryColor: "#764ba2",
    accentColor: "#f093fb",

    // Layout Settings
    sidebarVisible: true,
    darkMode: true,
    animations: true,
    pageTransition: true,
    borderRadius: "20px",
    shadow: true,
    layout: "luxury",
    fixedHeader: true,
    compactMode: false,
    maxContainerWidth: "1600px",

    // UI Components
    showTooltips: true,
    navIcons: true,
    roundedButtons: true,
    sidebarGradient: true,
    cardStyle: "glass",
    buttonStyle: "gradient",
    inputStyle: "luxury",
    hoverEffects: true,
    showAvatars: true,
    highlightActive: true,

    // User Experience
    notifications: true,
    autoSave: true,
    customCursor: false,
    accessibleMode: false,
    soundFeedback: false,

    // Localization
    language: "en",
    timeFormat: "24h",
    dateFormat: "DD/MM/YYYY",
    timezone: "UTC",

    // Advanced Settings
    debugMode: false,
    performanceMode: false,
    cacheEnabled: true,
    analyticsEnabled: true,

    // Security Settings
    sessionTimeout: "30",
    twoFactorAuth: false,
    loginAttempts: "5",
    passwordExpiry: "90",
  })

  const [originalSettings, setOriginalSettings] = useState({})

  // Fetch settings from database
  const fetchSettings = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL || "https://oms-api-production.up.railway.app"}/api/admin/settings`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )

      if (response.data.success) {
        const fetchedSettings = { ...settings, ...response.data.data }
        setSettings(fetchedSettings)
        setOriginalSettings(fetchedSettings)
        setMessage({ type: "success", text: "Settings loaded successfully!" })
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error)
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to load settings. Using defaults.",
      })
      setOriginalSettings(settings)
    } finally {
      setIsLoading(false)
      setTimeout(() => setMessage({ type: "", text: "" }), 3000)
    }
  }

  // Save settings to database
  const saveSettings = async () => {
    setIsSaving(true)
    try {
      const token = localStorage.getItem("token")
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL || "https://oms-api-production.up.railway.app"}/api/admin/settings`,
        { settings },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )

      if (response.data.success) {
        setOriginalSettings(settings)
        setHasChanges(false)
        setMessage({ type: "success", text: "Settings saved successfully!" })

        // Apply settings to the current session
        applySettings(settings)
      }
    } catch (error) {
      console.error("Failed to save settings:", error)
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to save settings. Please try again.",
      })
    } finally {
      setIsSaving(false)
      setTimeout(() => setMessage({ type: "", text: "" }), 3000)
    }
  }

  // Apply settings to the current session
  const applySettings = (settingsToApply) => {
    const root = document.documentElement

    // Apply CSS custom properties
    root.style.setProperty("--primary-color", settingsToApply.primaryColor)
    root.style.setProperty("--secondary-color", settingsToApply.secondaryColor)
    root.style.setProperty("--accent-color", settingsToApply.accentColor)
    root.style.setProperty("--font-size", settingsToApply.fontSize)
    root.style.setProperty("--font-family", settingsToApply.fontFamily)
    root.style.setProperty("--border-radius", settingsToApply.borderRadius)
    root.style.setProperty("--max-width", settingsToApply.maxContainerWidth)

    // Apply theme class
    document.body.className = `theme-${settingsToApply.theme} ${settingsToApply.darkMode ? "dark-mode" : "light-mode"}`

    // Store in localStorage for persistence
    localStorage.setItem("adminSettings", JSON.stringify(settingsToApply))
  }

  // Reset to defaults
  const resetToDefaults = () => {
    if (window.confirm("Are you sure you want to reset all settings to default values?")) {
      setSettings(originalSettings)
      setHasChanges(true)
      setMessage({ type: "info", text: "Settings reset to defaults. Click Save to apply." })
    }
  }

  // Export settings
  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)

    const exportFileDefaultName = `admin-settings-${new Date().toISOString().split("T")[0]}.json`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()

    setMessage({ type: "success", text: "Settings exported successfully!" })
    setTimeout(() => setMessage({ type: "", text: "" }), 3000)
  }

  // Import settings
  const importSettings = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const importedSettings = JSON.parse(e.target.result)
          setSettings({ ...settings, ...importedSettings })
          setHasChanges(true)
          setMessage({ type: "success", text: "Settings imported successfully! Click Save to apply." })
        } catch (error) {
          setMessage({ type: "error", text: "Invalid settings file format." })
        }
        setTimeout(() => setMessage({ type: "", text: "" }), 3000)
      }
      reader.readAsText(file)
    }
  }

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      navigate("/login")
      return
    }

    if (user && user.role === "admin") {
      fetchSettings()
    }
  }, [user, loading, navigate])

  useEffect(() => {
    // Check for changes
    const hasChanged = JSON.stringify(settings) !== JSON.stringify(originalSettings)
    setHasChanges(hasChanged)
  }, [settings, originalSettings])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleColorChange = (name, color) => {
    setSettings((prev) => ({
      ...prev,
      [name]: color,
    }))
  }

  // Group settings by category
  const settingsGroups = {
    Appearance: ["theme", "fontSize", "fontFamily", "primaryColor", "secondaryColor", "accentColor", "darkMode"],
    Layout: ["sidebarVisible", "layout", "fixedHeader", "compactMode", "maxContainerWidth", "borderRadius"],
    "UI Components": [
      "animations",
      "pageTransition",
      "shadow",
      "showTooltips",
      "navIcons",
      "roundedButtons",
      "sidebarGradient",
      "cardStyle",
      "buttonStyle",
      "inputStyle",
      "hoverEffects",
      "showAvatars",
      "highlightActive",
    ],
    "User Experience": ["notifications", "autoSave", "customCursor", "accessibleMode", "soundFeedback"],
    Localization: ["language", "timeFormat", "dateFormat", "timezone"],
    Advanced: ["debugMode", "performanceMode", "cacheEnabled", "analyticsEnabled"],
    Security: ["sessionTimeout", "twoFactorAuth", "loginAttempts", "passwordExpiry"],
  }

  if (loading || isLoading) {
    return (
      <div className="settings-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="settings-page">
      <div className="settings-header">
        <div className="header-content">
          <h1>Admin Settings</h1>
          <p>Customize your admin dashboard experience</p>
        </div>
        <div className="header-actions">
          <button onClick={() => navigate("/admin-dashboard")} className="back-btn">
            ← Back to Dashboard
          </button>
        </div>
      </div>

      {message.text && (
        <div className={`message-banner ${message.type}`}>
          <span className="message-icon">
            {message.type === "success" && "✅"}
            {message.type === "error" && "❌"}
            {message.type === "info" && "ℹ️"}
          </span>
          {message.text}
        </div>
      )}

      <div className="settings-actions">
        <div className="action-group">
          <button
            onClick={saveSettings}
            disabled={!hasChanges || isSaving}
            className={`save-btn ${hasChanges ? "has-changes" : ""}`}
          >
            {isSaving ? "💾 Saving..." : "💾 Save Changes"}
          </button>
          <button onClick={resetToDefaults} className="reset-btn">
            🔄 Reset to Defaults
          </button>
        </div>
        <div className="action-group">
          <button onClick={exportSettings} className="export-btn">
            📤 Export Settings
          </button>
          <label className="import-btn">
            📥 Import Settings
            <input type="file" accept=".json" onChange={importSettings} style={{ display: "none" }} />
          </label>
        </div>
      </div>

      <div className="settings-container">
        {Object.entries(settingsGroups).map(([groupName, groupKeys]) => (
          <div key={groupName} className="settings-group">
            <h2 className="group-title">{groupName}</h2>
            <div className="settings-grid">
              {groupKeys.map((key) => (
                <div className="setting-row" key={key}>
                  <div className="setting-info">
                    <label htmlFor={key} className="setting-label">
                      {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                    </label>
                    <span className="setting-description">{getSettingDescription(key)}</span>
                  </div>
                  <div className="setting-control">
                    {renderSettingControl(key, settings[key], handleChange, handleColorChange)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Helper function to get setting descriptions
const getSettingDescription = (key) => {
  const descriptions = {
    theme: "Overall visual theme of the dashboard",
    fontSize: "Base font size for the interface",
    fontFamily: "Primary font family used throughout",
    primaryColor: "Main brand color for buttons and accents",
    secondaryColor: "Secondary color for gradients",
    accentColor: "Accent color for highlights",
    darkMode: "Enable dark mode interface",
    sidebarVisible: "Show/hide the navigation sidebar",
    animations: "Enable smooth animations and transitions",
    pageTransition: "Enable page transition effects",
    borderRadius: "Roundness of UI elements",
    shadow: "Enable drop shadows on elements",
    layout: "Overall layout style",
    fixedHeader: "Keep header fixed while scrolling",
    compactMode: "Reduce spacing for compact view",
    maxContainerWidth: "Maximum width of content containers",
    showTooltips: "Show helpful tooltips on hover",
    navIcons: "Display icons in navigation",
    roundedButtons: "Use rounded button styles",
    sidebarGradient: "Apply gradient to sidebar",
    cardStyle: "Style of content cards",
    buttonStyle: "Button appearance style",
    inputStyle: "Input field appearance",
    hoverEffects: "Enable hover animations",
    showAvatars: "Display user avatars",
    highlightActive: "Highlight active navigation items",
    notifications: "Enable system notifications",
    autoSave: "Automatically save changes",
    customCursor: "Use custom cursor styles",
    accessibleMode: "Enhanced accessibility features",
    soundFeedback: "Audio feedback for actions",
    language: "Interface language",
    timeFormat: "Time display format",
    dateFormat: "Date display format",
    timezone: "Default timezone",
    debugMode: "Enable debug information",
    performanceMode: "Optimize for performance",
    cacheEnabled: "Enable data caching",
    analyticsEnabled: "Enable usage analytics",
    sessionTimeout: "Session timeout in minutes",
    twoFactorAuth: "Require two-factor authentication",
    loginAttempts: "Maximum login attempts",
    passwordExpiry: "Password expiry in days",
  }
  return descriptions[key] || "Configure this setting"
}

// Helper function to render appropriate control for each setting
const renderSettingControl = (key, value, handleChange, handleColorChange) => {
  // Color inputs
  if (key.includes("Color")) {
    return (
      <div className="color-input-container">
        <input
          type="color"
          name={key}
          value={value}
          onChange={(e) => handleColorChange(key, e.target.value)}
          className="color-input"
        />
        <input
          type="text"
          name={key}
          value={value}
          onChange={handleChange}
          className="color-text-input"
          placeholder="#000000"
        />
      </div>
    )
  }

  // Boolean toggles
  if (typeof value === "boolean") {
    return (
      <button
        className={`toggle-btn ${value ? "active" : ""}`}
        onClick={() =>
          handleChange({
            target: {
              name: key,
              type: "checkbox",
              checked: !value,
            },
          })
        }
      >
        <span className="toggle-slider"></span>
        <span className="toggle-text">{value ? "On" : "Off"}</span>
      </button>
    )
  }

  // Select dropdowns for specific keys
  const selectOptions = {
    theme: ["light", "dark", "luxury", "minimal"],
    fontFamily: ["Inter", "Arial", "Helvetica", "Georgia", "Times New Roman", "Courier New"],
    layout: ["default", "luxury", "minimal", "compact"],
    cardStyle: ["flat", "elevated", "glass", "outlined"],
    buttonStyle: ["solid", "gradient", "outlined", "ghost"],
    inputStyle: ["standard", "rounded", "luxury", "minimal"],
    language: ["en", "es", "fr", "de", "it", "pt"],
    timeFormat: ["12h", "24h"],
    dateFormat: ["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"],
    timezone: ["UTC", "EST", "PST", "GMT", "CET"],
  }

  if (selectOptions[key]) {
    return (
      <select name={key} value={value} onChange={handleChange} className="select-input">
        {selectOptions[key].map((option) => (
          <option key={option} value={option}>
            {option.toUpperCase()}
          </option>
        ))}
      </select>
    )
  }

  // Number inputs for specific keys
  if (["sessionTimeout", "loginAttempts", "passwordExpiry"].includes(key)) {
    return (
      <input
        type="number"
        name={key}
        value={value}
        onChange={handleChange}
        className="number-input"
        min="1"
        max={key === "sessionTimeout" ? "1440" : key === "loginAttempts" ? "10" : "365"}
      />
    )
  }

  // Default text input
  return <input type="text" name={key} value={value} onChange={handleChange} className="text-input" />
}

export default Settings
