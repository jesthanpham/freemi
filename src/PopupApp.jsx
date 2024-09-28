import { useState, useEffect } from "react";
import "./PopupApp.css";

function PopupApp() {
  const [blockedUrls, setBlockedUrls] = useState([]); // State for blocked URLs
  const [newUrl, setNewUrl] = useState(""); // State for new URL input
  const [blocking, setBlocking] = useState(); // State for blocking status

  useEffect(() => {
    // Get the blocked URLs from Chrome storage
    chrome.storage.sync.get("blockedUrls", ({ blockedUrls }) => {
      if (blockedUrls) {
        setBlockedUrls(blockedUrls);
      }
    });
    chrome.storage.sync.get("blocking", ({ blocking }) => {
      if (blocking) {
        setBlocking(blocking);
      }
    });
  }, []);

  const addUrl = () => {
    if (newUrl && !blockedUrls.includes(newUrl)) {
      const updatedBlockedUrls = [...blockedUrls, newUrl];
      setBlockedUrls(updatedBlockedUrls);
      setNewUrl(""); // Clear the input field

      // Store the updated blocked URLs in Chrome storage
      chrome.storage.sync.set({ blockedUrls: updatedBlockedUrls });
    }
  };

  const removeUrl = (urlToRemove) => {
    let newBlockList = blockedUrls.filter((url) => url !== urlToRemove);
    setBlockedUrls(newBlockList);
    chrome.storage.sync.set({ blockedUrls: newBlockList }); //update chrome storage
  };

  const toggleBlocking = () => {
    setBlocking(!blocking);
    chrome.storage.sync.set({ blocking: !blocking });
  };

  return (
    <div className="PopupApp">
      <div className="d-grid gap-2">
        <button
          className="btn btn-primary btn-lg m-2"
          type="button"
          onClick={() => toggleBlocking()}
        >
          {blocking ? "Blocking is ON" : "Blocking is OFF"}
        </button>
      </div>
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
