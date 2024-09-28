// content.js

chrome.storage.sync.get("blockedUrls", ({ blockedUrls }) => {
  const currentUrl = window.location.href;

  if (blockedUrls && blockedUrls.some((url) => currentUrl.includes(url))) {
    // Redirect the current tab to the Chrome New Tab page
    window.location.href = "chrome://newtab";
  }
});
