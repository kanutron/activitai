import { apiReport } from "./utils.js";

// Listen for messages from the content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "API_REPORT") {
    message.payload.tabId = sender.tab.id; // force sending the tabId
    const request = {
      method: message.method,
      body: JSON.stringify(message.payload),
    };
    apiReport(request);
  }
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url) {
    const payload = {
      url: tab.url,
      title: tab.title,
      tabId: tabId,
      event: "chrome:tab_updated",
    };
    await apiReport({
      method: "POST",
      body: JSON.stringify(payload),
    });
  }
});

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const tab = await chrome.tabs.get(activeInfo.tabId);
  if (tab.url) {
    const payload = {
      url: tab.url,
      title: tab.title,
      tabId: tab.id,
      event: "chrome:tab_activated",
    };
    await apiReport({
      method: "POST",
      body: JSON.stringify(payload),
    });
  }
});
