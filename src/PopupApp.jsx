import React from "react";
import "./PopupApp.css";

function PopupApp() {
  return (
    <div className="PopupApp">
      <header className="PopupApp-header">
        <h1>Extension Popup</h1>
      </header>
      <main className="PopupApp-main">
        <p>Quick actions and information can go here.</p>
        <button className="PopupApp-button">Open Settings</button>
      </main>
    </div>
  );
}

export default PopupApp;
