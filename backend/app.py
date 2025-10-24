from flask import Flask, request, jsonify
from flask_cors import CORS
from nasa_api import get_asteroid_data
from usgs_data import get_seismic_data
import math

app = Flask(__name__)
CORS(app)

def calculate_tsunami(energy_tnt, lat, lng):
    # Rough approximation of ocean
    ocean = abs(lat) < 60
    if ocean:
        if energy_tnt > 1e6:
            return "Very High"
        elif energy_tnt > 1e5:
            return "High"
        else:
            return "Moderate"
    return "None"

@app.route('/simulate', methods=['POST'])
def simulate():
    data = request.get_json()
    size = float(data['size'])
    velocity = float(data['velocity'])
    lat = float(data['lat'])
    lng = float(data['lng'])
    deflect = float(data['deflect'])  # New input (0-100%)

    # Step 1: Basic physics
    mass = (4/3) * 3.1416 * (size/2)**3 * 3000  # density ~3000 kg/m3
    energy = 0.5 * mass * (velocity * 1000)**2 / 4.184e9  # Joules to TNT

    # Step 2: Crater calculation
    crater = size * (velocity / 5)

    # Step 3: Deflection mitigation logic
    if deflect > 50:
        # Successful deflection
        result = {
            "mass_kg": mass,
            "energy_tnt": energy,
            "crater_diameter_m": 0,
            "tsunami_risk": "None",
            "seismic_event": False,
            "message": "🎯 Asteroid deflected successfully! Earth is safe."
        }
    else:
        # Impact still happens
        tsunami = "High" if lat > -60 and lat < 60 else "Low"
        result = {
            "mass_kg": mass,
            "energy_tnt": energy,
            "crater_diameter_m": crater,
            "tsunami_risk": tsunami,
            "seismic_event": True,
            "message": "☄️ Impact occurred! Earth was hit."
        }

    return jsonify(result)




if __name__ == "__main__":
    import os
    port = int(os.environ.get("PORT", 10000))  # Render assigns a PORT dynamically
    app.run(host="0.0.0.0", port=port)
    app.run(debug=True)








