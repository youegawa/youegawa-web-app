import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { AuthProvider } from "./Common/AuthContext";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("root 要素が見つかりません");
}

createRoot(rootElement).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
);
