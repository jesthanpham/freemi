import React, { useState, useEffect } from "react";
import axios from "axios";
import CalendarHeatmap from "react-calendar-heatmap";
import "../public/styles.css";

function App() {
  const [blockCounts, setBlockCounts] = useState({});
  const [quote, setQuote] = useState(""); // The full quote from OpenAI
  const [displayedQuote, setDisplayedQuote] = useState(""); // The quote that is displayed letter by letter
  const [isLoading, setIsLoading] = useState(false); // For showing a loading state
  const [error, setError] = useState(null); // To handle errors
  const [query, setQuery] = useState("");
  const [totalBlocks, setTotalBlocks] = useState(0);

  // Fetch blocked URLs from chrome storage
  useEffect(() => {
    chrome.storage.sync.get("blockCounts", ({ blockCounts }) => {
      setBlockCounts(blockCounts || {});
      setTotalBlocks(sumValues(blockCounts));
    });
  }, []);

  // Automatically generate the quote when blockCounts are updated
  useEffect(() => {
    if (Object.keys(blockCounts).length > 0) {
      generateQuote(); // Generate the quote after getting the blocked URLs
    }
  }, [blockCounts]);

  // Function to handle generating a motivational quote based on blocked websites
  const generateQuote = async () => {
    setIsLoading(true); // Start loading before API request
    setError(null); // Reset any previous errors
    setQuote(""); // Clear previous quote
    setDisplayedQuote(""); // Clear the displayed quote for typing effect

    const blockedUrls = Object.keys(blockCounts).join(", "); // Get blocked URLs as a string

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4", // Use the correct model
          messages: [
            {
              role: "user",
              content: `Generate a motivational quote focused on-self improvement. Incorporate keywords like empowering, to make the quote more specific and relevant. Set a tone that is caring, assertive and inspiring, ensuring it resonates with the intended audience of procrastination, lack of dedication and concentration. Draw inspiration from figures who overcame adversity while infusing a touch of humanity. Prioritize quotes that are concise, impactful, and filled with actionable advice. Emphasize getting back on track and encourage a hard working and growth mindset. 30 words max. This quote is one sentence and is also based on avoiding this websites: ${blockedUrls}.`,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_APP_API_KEY}`,
            "Content-Type": "application/json",
            "OpenAI-Organization": import.meta.env.VITE_APP_ORG_ID,
          },
        }
      );

      // Ensure the response has valid data before using it
      const fullQuote = response.data?.choices?.[0]?.message?.content ?? "";
      if (fullQuote) {
        setQuote(fullQuote.trim()); // Set the quote without adding extra quotes
      } else {
        throw new Error("No quote received");
      }
    } catch (error) {
      console.error("Error fetching response from OpenAI:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false); // End loading after API request
    }
  };

  // Typing effect to display the quote one letter at a time
  useEffect(() => {
    if (quote) {
      let index = 0;
      const typingInterval = setInterval(() => {
        if (index < quote.length) {
          setDisplayedQuote((prev) => prev + quote.charAt(index));
          index++;
        } else {
          clearInterval(typingInterval); // Stop the interval when the full quote is displayed
        }
      }, 50); // Adjust the speed of typing by changing the interval duration (in milliseconds)

      return () => clearInterval(typingInterval); // Clean up interval on component unmount
    }
  }, [quote]);

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
      <div className="logo-search">
        <h1 className="title">Freemi</h1>
        <div className="search-container">
          <input
            type="text"
            z
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search, without the noise..."
            className="search-input"
          />
          <button onClick={handleSearch} className="search-button">
            Search
          </button>
        </div>
      </div>
      <div>Your insights</div>
      <CalendarHeatmap
        startDate={new Date("2016-01-01")}
        endDate={new Date("2016-04-01")}
        values={[
          { date: "2016-01-01", count: 12 },
          { date: "2016-01-22", count: 122 },
          { date: "2016-01-30", count: 38 },
          // ...and so on
        ]}
      />

      <div className="container">
        <div className="panel">
          {" "}
          <p className="panel-header">Attempted to visit...</p>
          {blockCountEntries.length > 0 ? (
            <ul>
              {blockCountEntries.map(([url, count]) => (
                <li key={url}>
                  <strong>{formatUrl(url)}</strong>
                  &nbsp;{count} {count === 1 ? "time" : "times"}
                </li>
              ))}
            </ul>
          ) : (
            <p>No URLs have been blocked yet.</p>
          )}
        </div>

        <div className="panel">
          <div>
            <p className="panel-header">Motivational Quote</p>

            {/* Show the loading state */}
            {isLoading && <p>Loading quote...</p>}

            {/* Show error if there is one */}
            {error && <p style={{ color: "red" }}>{error}</p>}

            {/* Display the quote letter by letter */}
            <div>
              <p>"{displayedQuote.replace(/^"|"$/g, "")}"</p>{" "}
              {/* Wrap the displayedQuote in quotes here */}
            </div>
          </div>
        </div>
        <div className="panel">
          <p className="panel-header">Freemi has kept you on track... </p>
          <h1 className="big-num">{totalBlocks}</h1>
          <p className="panel-header">{totalBlocks === 1 ? "time" : "times"}</p>
        </div>
      </div>
    </div>
  );
}

export default App;
