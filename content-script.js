console.log("✅ Fake News Detector content script loaded");

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action === "showFactCheckResult") {
    const { claim, result } = msg;

    let popup = document.getElementById("fact-check-popup");
    if (!popup) {
      // Create new popup container
      popup = document.createElement("div");
      popup.id = "fact-check-popup";
      popup.style.position = "fixed";
      popup.style.bottom = "24px";
      popup.style.right = "24px";
      popup.style.background = "#ffffff";
      popup.style.padding = "18px";
      popup.style.borderRadius = "12px";
      popup.style.boxShadow = "0 8px 20px rgba(0,0,0,0.25)";
      popup.style.fontFamily = "Segoe UI, Roboto, sans-serif";
      popup.style.zIndex = "99999";
      popup.style.width = "340px";
      popup.style.border = "1px solid #e5e7eb";
      popup.style.transition = "all 0.3s ease";
      document.body.appendChild(popup);
    }

    // Verdict color
    let verdictColor = "#6b7280"; // gray
    if (result.verdict.toLowerCase() === "fake") verdictColor = "#dc2626"; // red
    else if (result.verdict.toLowerCase() === "real") verdictColor = "#16a34a"; // green
    else if (result.verdict.toLowerCase().includes("loading")) verdictColor = "#f59e0b"; // amber

    // Spinner for loading
    const spinner =
      `<div style="display:flex;align-items:center;justify-content:center;margin:12px 0;">
         <div style="
            width:20px;height:20px;
            border:3px solid #ddd;
            border-top:3px solid #2563eb;
            border-radius:50%;
            animation: spin 1s linear infinite;
         "></div>
       </div>
       <style>
         @keyframes spin { 100% { transform: rotate(360deg); } }
       </style>`;

    popup.innerHTML = `
      <h4 style="margin:0 0 10px 0; font-size:15px; font-weight:600; color:#111827;">
        🔍 Fact-check Result
      </h4>
      <p style="font-size:13px; margin:6px 0; line-height:1.4;"><b>Claim:</b> ${claim}</p>
      <p style="font-size:13px; margin:6px 0; color:${verdictColor};">
        <b>Verdict:</b> ${result.verdict}
      </p>
      <p style="font-size:13px; margin:6px 0;"><b>Confidence:</b> ${result.confidence_percentage}%</p>
      ${result.verdict.toLowerCase().includes("loading") ? spinner : ""}
      <div style="text-align:right;">
        <button id="closeFactCheck" style="
          margin-top:10px; padding:6px 14px; background:#2563eb;
          color:white; font-size:13px; font-weight:500;
          border:none; border-radius:6px; cursor:pointer;
          transition: background 0.2s ease;
        ">Close</button>
      </div>
    `;

    // Close button action
    document.getElementById("closeFactCheck").onclick = () => popup.remove();
  }
});
