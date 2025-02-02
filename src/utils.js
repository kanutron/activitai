export const getServerUrl = async () => {
  const result = await chrome.storage.sync.get(["SERVER_URL"]);
  return result.SERVER_URL || "http://localhost:4000";
};

export const apiReport = async (req) => {
  const server = await getServerUrl();
  const url = `${server}/v1/report`;
  req.headers = req.headers || { "Content-Type": "application/json" };
  try {
    await fetch(url, req);
  } catch (error) {
    console.error("Failed to send data to server:", error, url, req);
  }
};
