// content.js
chrome.storage.sync.get(
  ["blockedUrls", "blocking"],
  ({ blockedUrls, blocking }) => {
    const currentUrl = window.location.href;
    if (blocking) {
      if (blockedUrls && blockedUrls.some((url) => currentUrl.includes(url))) {
        // Content script can't use tab API, so we have to send a message to background.js
        chrome.runtime.sendMessage({ action: "redirect" });
      }
    }
  }
);
