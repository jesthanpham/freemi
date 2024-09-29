//listen for messages from the content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "redirect") {
    chrome.tabs.create({ url: "chrome://newtab" }, (tab) => {
      chrome.tabs.remove(sender.tab.id);
    });
    storeDate(new Date().toISOString());
  }
});

function storeDate(date) {
  chrome.storage.sync.get({ dates: [] }, (result) => {
    const dates = result.dates;
    dates.push(date); // Add the new date to the array
    chrome.storage.sync.set({ dates: dates }, () => {
      console.log("Date stored:", date);
    });
  });
}

function getDates(callback) {
  chrome.storage.sync.get({ dates: [] }, (result) => {
    callback(result.dates);
  });
}
