import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/context";
import { TaskProvider } from "./context/taskcontext";
import { LeaveProvider } from "./context/leavecontext";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <TaskProvider>
          <LeaveProvider>
            <App />
          </LeaveProvider>
        </TaskProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
