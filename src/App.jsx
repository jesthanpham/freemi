import React, { useState, useEffect } from "react";

function App() {
  const [blockCounts, setBlockCounts] = useState({});

  useEffect(() => {
    chrome.storage.sync.get("blockCounts", ({ blockCounts }) => {
      setBlockCounts(blockCounts || {});
    });
  }, []);

  const blockCountEntries = Object.entries(blockCounts);

  return (
    <div className="App">
      <h1>Despite blocking these sites, you've attempted to visit...</h1>
      {blockCountEntries.length > 0 ? (
        <ul>
          {blockCountEntries.map(([url, count]) => (
            <li key={url}>
              {url}: {count} time(s) blocked
            </li>
          ))}
        </ul>
      ) : (
        <p>No URLs have been blocked yet.</p>
      )}
    </div>
  );
}

export default App;
