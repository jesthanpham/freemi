import React, { useState, useEffect } from "react";

function App() {
  const [blockCounts, setBlockCounts] = useState({});
  const [query, setQuery] = useState("");
  const [totalBlocks, setTotalBlocks] = useState(0);

  useEffect(() => {
    chrome.storage.sync.get("blockCounts", ({ blockCounts }) => {
      setBlockCounts(blockCounts || {});
      setTotalBlocks(sumValues(blockCounts));
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

  const sumValues = (obj) => {
    return Object.values(obj).reduce((accumulator, currentValue) => {
      return accumulator + currentValue;
    }, 0);
  };

  const formatUrl = (url) => {
    const match = url.match(/^(?:https?:\/\/)?(?:www\.)?([^\/]+)(?:\/.*)?$/);
    return match ? match[1].split(".")[0] : null;
  };

  return (
    <div className="App">
      <ul className="nav">
        <li>
          <h2 className=" nav-item title">Freemi</h2>
        </li>
        <li className="nav-item">
          <a href="blocked.html">Blocked Sites</a>
        </li>
      </ul>
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
      <h1>You've strayed away... </h1>
      <h1 className="big-num">{totalBlocks}</h1>

      <h1>Despite blocking these sites, you've attempted to visit...</h1>

      {blockCountEntries.length > 0 ? (
        <ul>
          {blockCountEntries.map(([url, count]) => (
            <li key={url}>
              {formatUrl(url)} {count} times
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
