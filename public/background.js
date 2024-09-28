//listen for messages from the content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "redirect") {
    chrome.tabs.create({ url: "chrome://newtab" }, (tab) => {
      chrome.tabs.remove(sender.tab.id);
    });
  }
});
