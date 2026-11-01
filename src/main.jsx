import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";
import "./workspace.css";
import "./brand.css";

class ErrorBoundary extends React.Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (this.state.failed)
      return (
        <div className="error-fallback">
          <h1>Let’s get you back in the flow.</h1>
          <p>
            Something unexpected happened. Your saved results are still on this
            device.
          </p>
          <button
            className="primary-button"
            onClick={() => window.location.reload()}
          >
            Reload TypeOrbit
          </button>
        </div>
      );
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
);
