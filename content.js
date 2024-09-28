// content.js

chrome.storage.sync.get("blockedUrls", ({ blockedUrls }) => {
  const currentUrl = window.location.href;

  if (blockedUrls && blockedUrls.some((url) => currentUrl.includes(url))) {
    // Redirect to the redirect.html page or any other logic
    chrome.runtime.sendMessage({ action: "redirect", url: currentUrl });
  }
});
