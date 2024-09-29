import React, { useState, useEffect } from "react";

function App() {
  const [blockCounts, setBlockCounts] = useState({});
  const [query, setQuery] = useState("");

  useEffect(() => {
    chrome.storage.sync.get("blockCounts", ({ blockCounts }) => {
      setBlockCounts(blockCounts || {});
    });
  }, []);

  const blockCountEntries = Object.entries(blockCounts);

  const handleSearch = () => {
    if (query) {
      // Redirect to Google search with the query
      window.location.href = `https://www.google.com/search?q=${encodeURIComponent(
        query
      )}`;
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="App">
      <h1>Despite blocking these sites, you've attempted to visit...</h1>
      <div className="search-container">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Search the web"
          className="search-input"
        />
        <button onClick={handleSearch} className="search-button">
          Search
        </button>
      </div>
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
