// ===============================
// 🚀 Asteroid Impact Simulator
// Beginner-friendly JavaScript
// ===============================

// Wait until the page fully loads
window.onload = function () {
  console.log("🌍 Asteroid Impact Simulator loaded");

  // Step 1: Initialize the map
  // Using Leaflet.js to create a simple map centered at (0, 0)
  const map = L.map("map").setView([0, 0], 2);

  // Step 2: Add the map tiles (visual layout)
  // These are OpenStreetMap tiles (free and public)
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 8,
    attribution: "© OpenStreetMap contributors"
  }).addTo(map);

  // Step 3: Connect to HTML form inputs
  const sizeInput = document.getElementById("size");
  const velocityInput = document.getElementById("velocity");
  const deflectInput = document.getElementById("deflect");
  const simulateBtn = document.getElementById("simulateBtn");
  const resultsDiv = document.getElementById("results");

  // Step 4: Add click event to the "Simulate" button
  simulateBtn.addEventListener("click", async () => {
    // Ask user where to impact
    const lat = parseFloat(prompt("Enter impact latitude (-90 to 90):", "10"));
    const lng = parseFloat(prompt("Enter impact longitude (-180 to 180):", "80"));

    // Step 5: Collect input values
    const size = parseFloat(sizeInput.value);
    const velocity = parseFloat(velocityInput.value);
    const deflect = parseFloat(deflectInput.value);

    // Step 6: Send this data to Flask backend
    const response = await fetch("http://127.0.0.1:5000/simulate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ size, velocity, lat, lng, deflect })
    });

    const data = await response.json();

    // Step 7: Clear any previous map visuals
    map.eachLayer(layer => {
      if (layer instanceof L.Circle || layer instanceof L.Polyline || layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    // Step 8: Show updated base map again
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 8,
      attribution: "© OpenStreetMap contributors"
    }).addTo(map);

    // Step 9: Display results on the webpage
    resultsDiv.innerHTML = `
      <h3>🌠 Simulation Results</h3>
      <p><b>Mass:</b> ${data.mass_kg.toFixed(2)} kg</p>
      <p><b>Energy:</b> ${data.energy_tnt.toExponential(2)} tons TNT</p>
      <p><b>Crater Diameter:</b> ${data.crater_diameter_m.toFixed(1)} meters</p>
      <p><b>Tsunami Risk:</b> ${data.tsunami_risk}</p>
      <p><b>Seismic Event:</b> ${data.seismic_event ? "Yes" : "No"}</p>
      <h4>${data.message}</h4>
    `;

    // Step 10: Mark the impact or deflection visually

    if (data.crater_diameter_m > 0) {
      // Red crater for impact
      L.circle([lat, lng], {
        color: "red",
        fillColor: "#f03",
        fillOpacity: 0.4,
        radius: data.crater_diameter_m * 10 // exaggerated for visibility
      })
        .addTo(map)
        .bindPopup("☄️ Asteroid Impact Crater");
    } else {
      // Green marker for successful deflection
      L.marker([lat, lng])
        .addTo(map)
        .bindPopup("🛡️ Asteroid Deflected — Earth Safe!");
    }

    // Step 11: Draw asteroid trajectory (yellow dashed line)
    if (window.trajectoryLine) {
      map.removeLayer(window.trajectoryLine);
    }

    const entryLat = lat + (Math.random() * 40 - 20);
    const entryLng = lng + (Math.random() * 40 - 20);

    window.trajectoryLine = L.polyline(
      [
        [entryLat, entryLng],
        [lat, lng]
      ],
      {
        color: "yellow",
        weight: 3,
        dashArray: "5, 10",
        opacity: 0.8
      }
    ).addTo(map);

    L.marker([entryLat, entryLng])
      .addTo(map)
      .bindPopup("🚀 Asteroid Entry Point");

    // Step 12: Show tsunami zone (if applicable)
    if (data.tsunami_risk === "High") {
      L.circle([lat, lng], {
        color: "blue",
        fillColor: "skyblue",
        fillOpacity: 0.3,
        radius: data.crater_diameter_m * 20
      })
        .addTo(map)
        .bindPopup("🌊 Potential Tsunami Zone");
    }

    // Step 13: Zoom into the impact/deflection site
    map.setView([lat, lng], 4);
  });
  // Optional: Show tooltip info when hovering over results
function addInfoTooltips() {
  const tips = {
    Mass: "Asteroid mass = volume × density (approx 3000 kg/m³)",
    Energy: "Impact energy in TNT = 0.5 × mass × velocity² (converted to TNT equivalent)",
    "Crater Diameter": "Estimated from size and velocity — bigger/faster → larger crater",
    "Tsunami Risk": "If near ocean, waves may form based on energy and depth",
    "Seismic Event": "Indicates if the impact can cause ground shaking",
    "Deflection Strategy": "A technique to slightly change asteroid’s velocity before impact"
  };

  // Loop through each term and add title tooltip
  Object.keys(tips).forEach(term => {
    const el = [...document.querySelectorAll("#results b")]
      .find(b => b.innerText.includes(term));
    if (el) el.title = tips[term];
  });
}

// Run tooltips every time results are updated
simulateBtn.addEventListener("click", () => {
  setTimeout(addInfoTooltips, 1000);
});

};







