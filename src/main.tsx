import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Handle chunk loading errors (occurs when a new deployment happens and old chunks are missing)
const reloadKey = "zetta_chunk_reload_attempts";

const handleReload = () => {
  const lastReload = sessionStorage.getItem(reloadKey);
  const now = Date.now();
  
  // If we reloaded less than 10 seconds ago, do not reload again to prevent infinite loop
  if (lastReload && now - parseInt(lastReload, 10) < 10000) {
    console.error("Chunk loading failed repeatedly. Preventing infinite reload loop.");
    return;
  }
  
  sessionStorage.setItem(reloadKey, now.toString());
  window.location.reload();
};

window.addEventListener("vite:preloadError", (event) => {
  console.warn("Vite preload error detected, reloading page...", event);
  handleReload();
});

window.addEventListener("error", (event) => {
  if (
    event.message &&
    (event.message.includes("Failed to fetch dynamically imported module") ||
      event.message.includes("error loading dynamically imported module"))
  ) {
    console.warn("Dynamic import error detected, reloading page...", event);
    handleReload();
  }
});

createRoot(document.getElementById("root")!).render(<App />);
