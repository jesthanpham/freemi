// content.js
chrome.storage.sync.get("blockedUrls", ({ blockedUrls }) => {
  const currentUrl = window.location.href;

  if (blockedUrls && blockedUrls.some((url) => currentUrl.includes(url))) {
    console.log("blocking url: ", currentUrl);
    // content script can't use tab API, so we have to send a msg to background.js
    chrome.runtime.sendMessage({ action: "redirect" });
  }
});
