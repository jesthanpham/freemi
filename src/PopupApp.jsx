import { useState } from "react";
import "./PopupApp.css";

function PopupApp() {
  const [blockedUrls, setBlockedUrls] = useState([]); // State for blocked URLs
  const [newUrl, setNewUrl] = useState(""); // State for new URL input

  const addUrl = () => {
    if (newUrl && !blockedUrls.includes(newUrl)) {
      const updatedBlockedUrls = [...blockedUrls, newUrl];
      setBlockedUrls(updatedBlockedUrls);
      setNewUrl(""); // Clear the input field

      // Store the updated blocked URLs in Chrome storage
      chrome.storage.sync.set({ blockedUrls: updatedBlockedUrls });
      console.log("Blocked URLs updated:", updatedBlockedUrls);
    }
  };

  const removeUrl = (urlToRemove) => {
    setBlockedUrls(blockedUrls.filter((url) => url !== urlToRemove));
  };

  return (
    <div className="PopupApp">
      <header className="PopupApp-header">
        <h1>Extension Popup</h1>
      </header>
      <main className="PopupApp-main">
        <p>Block URLs:</p>
        <input
          type="text"
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
          placeholder="Enter URL to block"
        />
        <button className="PopupApp-button" onClick={addUrl}>
          Add URL
        </button>

        <ul className="PopupApp-url-list">
          {blockedUrls.map((url, index) => (
            <li key={index} className="PopupApp-url-item">
              {url}
              <button onClick={() => removeUrl(url)}>Remove</button>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}

export default PopupApp;
