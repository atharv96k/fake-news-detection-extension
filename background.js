chrome.runtime.onInstalled.addListener(() => {
  console.log("✅ Fake News Detector Extension Installed");
  chrome.contextMenus.create({
    id: "factCheck",
    title: "Fact-check this text",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "factCheck") {
    const claim = info.selectionText;

    // Step 1: Show "loading" popup immediately
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (claim) => {
        chrome.runtime.sendMessage({
          action: "showFactCheckResult",
          claim,
          result: {
            verdict: "Loading…",
            confidence_percentage: "—"
          }
        });
      },
      args: [claim]
    });

    // Step 2: Call API
    try {
      const res = await fetch("https://fake-news-detection-n9cs.onrender.com/fact-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: claim })
      });
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      const data = await res.json();

      // Step 3: Update popup with real result
      chrome.tabs.sendMessage(tab.id, {
        action: "showFactCheckResult",
        claim,
        result: data
      });

    } catch (err) {
      console.error("Error:", err);
      chrome.tabs.sendMessage(tab.id, {
        action: "showFactCheckResult",
        claim,
        result: {
          verdict: "Error ❌",
          confidence_percentage: "—"
        }
      });
    }
  }
});
