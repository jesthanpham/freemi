import { useState, useEffect } from "react";
import "./PopupApp.css";
import "../public/bootstrap.min.css";

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

  function isValidUrl(string) {
    try {
      new URL(string);
      return true;
    } catch (error) {
      return false;
    }
  }

  const addUrl = () => {
    let sanitizedURL;

    //if user inputed a full form url sanitize it
    if (isValidUrl(newUrl)) {
      const urlObject = new URL(newUrl);
      sanitizedURL = urlObject.hostname;
    } else {
      sanitizedURL = newUrl;
    }

    if (sanitizedURL && !blockedUrls.includes(sanitizedURL)) {
      const updatedBlockedUrls = [...blockedUrls, sanitizedURL];
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
    <div className="PopupApp m-2">
      <div className="d-grid">
        <button
          className="btn btn-primary btn-lg "
          type="button"
          onClick={() => toggleBlocking()}
        >
          {blocking ? "Blocking is ON" : "Blocking is OFF"}
        </button>
      </div>
      <main className="PopupApp-main">
        <div className="input-group mb-2">
          <input
            className="form-control"
            type="text"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                addUrl(); // Call the button function when Enter is pressed
              }
            }}
            placeholder="Enter URL to block"
          />
          <button
            className="btn btn-outline-secondary"
            type="button"
            onClick={addUrl}
          >
            Add URL
          </button>
        </div>

        <ul className="list-group row">
          {blockedUrls.map((url, index) => (
            <li key={index} className="list-group-item ">
              <div className="row">
                <div className="col-10 fw-semibold">{url}</div>
                <div
                  className="col-2 remove-btn"
                  onClick={() => removeUrl(url)}
                >
                  <svg
                    version="1.1"
                    id="Layer_1"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                    x="0px"
                    y="0px"
                    width="25px"
                    height="25px"
                    viewBox="0 0 122.879 122.879"
                    enable-background="new 0 0 122.879 122.879"
                    xml:space="preserve"
                  >
                    <g>
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        fill="#FF4141"
                        d="M61.44,0c33.933,0,61.439,27.507,61.439,61.439 s-27.506,61.439-61.439,61.439C27.507,122.879,0,95.372,0,61.439S27.507,0,61.44,0L61.44,0z M73.451,39.151 c2.75-2.793,7.221-2.805,9.986-0.027c2.764,2.776,2.775,7.292,0.027,10.083L71.4,61.445l12.076,12.249 c2.729,2.77,2.689,7.257-0.08,10.022c-2.773,2.765-7.23,2.758-9.955-0.013L61.446,71.54L49.428,83.728 c-2.75,2.793-7.22,2.805-9.986,0.027c-2.763-2.776-2.776-7.293-0.027-10.084L51.48,61.434L39.403,49.185 c-2.728-2.769-2.689-7.256,0.082-10.022c2.772-2.765,7.229-2.758,9.953,0.013l11.997,12.165L73.451,39.151L73.451,39.151z"
                      />
                    </g>
                  </svg>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}

export default PopupApp;
