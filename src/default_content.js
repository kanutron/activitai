let lastTitle = null;

// Periodically check for title changes
setInterval(checkTitle, 1000); // Check title change every second

function checkTitle() {
  // skip if the page is not loaded
  if (document.readyState !== "complete") {
    return;
  }
  // report title change
  const currentTitle = document.title;
  if (currentTitle !== lastTitle) {
    chrome.runtime.sendMessage({
      type: "API_REPORT",
      method: "PATCH",
      payload: {
        url: window.location.href,
        title: currentTitle,
        event: "chrome:tab_title_changed",
      },
    });
    lastTitle = currentTitle;
  }
}
