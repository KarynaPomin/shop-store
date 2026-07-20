import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import reportWebVitals from "./reportWebVitals";
import { StoreProvider } from "./context/StoreContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import "./styles/global.css";
import ScrollToTop from "./components/common/ScrollToTop.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./context/AuthContext.jsx";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <ThemeProvider>
          <StoreProvider>
            <App />
          </StoreProvider>
        </ThemeProvider>
      </BrowserRouter>
    </AuthProvider>
  </GoogleOAuthProvider>,
);

reportWebVitals();
