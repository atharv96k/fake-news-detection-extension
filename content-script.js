console.log("✅ Fake News Detector content script loaded");

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "showFactCheckResult") {
    const { claim, result } = msg;
 
    const oldPopup = document.getElementById("fact-check-popup");
    if (oldPopup) oldPopup.remove();
 
    const selection = window.getSelection();
    let x = 50, y = 50; 
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      x = rect.left + window.scrollX;
      y = rect.top + window.scrollY;
    }

    // Create popup
    const popup = document.createElement("div");
    popup.id = "fact-check-popup";
    popup.style.position = "absolute";
    popup.style.top = `${y + 25}px`;
    popup.style.left = `${x}px`;
    popup.style.background = "#ffffff";
    popup.style.padding = "16px";
    popup.style.borderRadius = "12px";
    popup.style.boxShadow = "0 6px 16px rgba(0,0,0,0.25)";
    popup.style.fontFamily = "Segoe UI, Roboto, sans-serif";
    popup.style.zIndex = "99999";
    popup.style.width = "320px";
    popup.style.border = "1px solid #e5e7eb";

    // Color verdict
    const verdictColor =
      result.verdict.toLowerCase() === "fake"
        ? "red"
        : result.verdict.toLowerCase() === "real"
        ? "green"
        : "orange";

    popup.innerHTML = `
      <h4 style="margin: 0 0 10px 0; font-size: 15px; font-weight: 600; color: #111827; display:flex; align-items:center; gap:6px;">
        🔍 Fact-check Result
      </h4>
      <p style="font-size: 13px; margin: 6px 0; line-height:1.4;"><b>Claim:</b> ${claim}</p>
      <p style="font-size: 13px; margin: 6px 0; color:${verdictColor};"><b>Verdict:</b> ${result.verdict}</p>
      <p style="font-size: 13px; margin: 6px 0;"><b>Confidence:</b> ${result.confidence_percentage}%</p>
      <div style="text-align:right;">
        <button id="closeFactCheck" style="
          margin-top: 10px; padding: 6px 14px; background: #2563eb;
          color: white; font-size: 13px; font-weight: 500;
          border: none; border-radius: 6px; cursor: pointer;
          transition: background 0.2s;
          text-decoration: none;
        ">Close</button>
      </div>
    `;

    document.body.appendChild(popup);

    // Close button
    document.getElementById("closeFactCheck").onclick = () => popup.remove();
  }
});
