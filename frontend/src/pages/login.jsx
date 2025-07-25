"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/context"
import "./login.css"
import "./login-only-no-scroll.css" // Targeted CSS only for login

const Login = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setemail] = useState("")
  const [password, setpassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Add login-specific class only when on login page
  useEffect(() => {
    // Add class to body and html for login page
    document.body.classList.add("login-active")
    document.documentElement.classList.add("login-active")

    // Cleanup: Remove class when leaving login page
    return () => {
      document.body.classList.remove("login-active")
      document.documentElement.classList.remove("login-active")

      // Restore normal scrolling for other pages
      document.body.style.overflow = "auto"
      document.documentElement.style.overflow = "auto"
      document.body.style.height = "auto"
      document.documentElement.style.height = "auto"
    }
  }, [])

  const handlesubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setIsLoading(true)

    if (!email || !password) {
      setError("⚠️ Please enter both email and password.")
      setIsLoading(false)
      return
    }

    try {
      const res = await axios.post("https://oms-api-production.up.railway.app/api/auth/login", {
        email,
        password,
      })

      login(res.data)
      setSuccess("✅ Login successful!")
      console.log("Login Response:", res.data)

      // Remove login classes before navigation
      document.body.classList.remove("login-active")
      document.documentElement.classList.remove("login-active")

      if (res.data.user.role === "admin") {
        navigate("/admin-dashboard")
      } else if (res.data.user.role === "employee") {
        navigate("/employee-dashboard")
      }
    } catch (err) {
      console.error("Login error:", err)
      if (axios.isAxiosError(err)) {
        if (err.response) {
          const status = err.response.status
          const message = err.response.data?.message || err.response.data?.error
          switch (status) {
            case 400:
              setError("⚠️ Invalid email or password format.")
              break
            case 401:
              setError("⚠️ Invalid details. Please check your email and password.")
              break
            case 404:
              setError("⚠️ Login service not found. Please try again later.")
              break
            case 500:
              setError("⚠️ Server error. Please try again later.")
              break
            default:
              setError(message || "⚠️ Login failed. Please try again.")
          }
        } else if (err.request) {
          setError("⚠️ Network error. Please check your connection and try again.")
        } else {
          setError("⚠️ An unexpected error occurred. Please try again.")
        }
      } else {
        setError("⚠️ An unexpected error occurred. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="login-page">
      <h1 className="main-title">Employee Management Portal</h1>
      <h2 className="sub-title">Log in</h2>
      <form className="form" onSubmit={handlesubmit}>
        <div className="container">
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setemail(e.target.value)}
            disabled={isLoading}
            required
          />
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setpassword(e.target.value)}
            disabled={isLoading}
            required
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Log In"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default Login
