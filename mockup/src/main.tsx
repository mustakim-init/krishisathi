import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "material/styles";
import "./patch";
import "./theme.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
