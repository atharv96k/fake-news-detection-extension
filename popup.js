const BACKEND_URL = "https://fake-news-detection-n9cs.onrender.com"; 

document.getElementById("checkBtn").addEventListener("click", async () => {
    const claim = document.getElementById("claimInput").value.trim();
    if (!claim) return alert("Please enter a claim.");
    
    document.getElementById("loader").classList.remove("hidden");
    document.getElementById("result").classList.add("hidden");
    
    try {
        const res = await fetch(`${BACKEND_URL}/fact-check`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query: claim })
        });
        
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        
        document.getElementById("loader").classList.add("hidden");
        
        const confidenceWidth = `${data.confidence_percentage || 0}%`;
        
        const resultDiv = document.getElementById("result");
        resultDiv.classList.remove("hidden");
        
        // Clear previous content
        resultDiv.innerHTML = ''; // Safe to clear with innerHTML here
        
        // Verdict
        const verdictPara = document.createElement("p");
        verdictPara.className = `verdict ${data.verdict.toLowerCase()}`;
        verdictPara.textContent = `Verdict: ${data.verdict}`;
        resultDiv.appendChild(verdictPara);
        
        // Confidence Bar
        const confidenceBar = document.createElement("div");
        confidenceBar.className = "confidence-bar";
        const confidenceFill = document.createElement("div");
        confidenceFill.className = "confidence-fill";
        confidenceFill.style.width = confidenceWidth;
        confidenceBar.appendChild(confidenceFill);
        resultDiv.appendChild(confidenceBar);
        
        // Confidence Percentage
        const confidencePara = document.createElement("p");
        confidencePara.style.margin = "8px 0";
        confidencePara.style.fontSize = "0.9rem";
        confidencePara.textContent = `Confidence: ${data.confidence_percentage}%`;
        resultDiv.appendChild(confidencePara);
        
        // Sources
        const sourcesDiv = document.createElement("div");
        sourcesDiv.className = "sources";
        const sourcesHeader = document.createElement("h4");
        sourcesHeader.textContent = "Sources:";
        sourcesDiv.appendChild(sourcesHeader);
        
        const sourcesList = data.top_3_sources && data.top_3_sources.length > 0
            ? data.top_3_sources.map(src => {
                const link = document.createElement("a");
                link.href = src.url;
                link.target = "_blank";
                link.rel = "noopener noreferrer";
                link.className = "source-item";
                link.title = src.title;
                link.textContent = src.title;
                return link;
            })
            : [document.createElement("p")];
        if (sourcesList.length === 1) {
            sourcesList[0].textContent = "No sources available";
            sourcesList[0].style.cssText = "color: #9ca3af; font-size: 0.85rem; font-style: italic;";
        }
        sourcesList.forEach(link => sourcesDiv.appendChild(link));
        resultDiv.appendChild(sourcesDiv);
        
    } catch (err) {
        document.getElementById("loader").classList.add("hidden");
        const resultDiv = document.getElementById("result");
        resultDiv.classList.remove("hidden");
        resultDiv.innerHTML = ''; // Safe to clear here
        
        const errorPara = document.createElement("p");
        errorPara.className = "verdict false";
        let errorMessage = "Could not fetch result.";
        if (err.message.includes('Failed to fetch')) {
            errorMessage = "Network error. Check if the backend is running.";
        } else if (err.message.includes('HTTP error')) {
            errorMessage = `Server returned: ${err.message}`;
        }
        errorPara.textContent = `⚠️ Error: ${errorMessage}`;
        resultDiv.appendChild(errorPara);
        console.error('Extension error:', err);
    }
});