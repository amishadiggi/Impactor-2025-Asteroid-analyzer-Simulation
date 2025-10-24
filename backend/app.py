from flask import Flask, request, jsonify
import math
import numpy as np

app = Flask(__name__)

# Default asteroid simulation function
def simulate_impact(diameter, velocity):
    # Constants
    density = 3000  # kg/m³
    g = 9.81  # m/s²
    
    # Mass
    radius = diameter / 2
    volume = (4/3) * math.pi * (radius**3)
    mass = density * volume  # kg

    # Kinetic energy in Joules
    energy_j = 0.5 * mass * (velocity * 1000)**2  # velocity in m/s
    energy_tnt = energy_j / 4.184e12  # convert Joules to TNT equivalent

    # Crater diameter approximation (meters)
    crater_diameter = 20 * (energy_tnt**0.33)

    # Tsunami and seismic approximation
    tsunami = "High" if radius > 50 else "Low"
    seismic = "Yes" if radius > 30 else "No"

    result = {
        "Mass (kg)": round(mass, 2),
        "Energy (TNT)": "{:.2e}".format(energy_tnt),
        "Crater Diameter (m)": round(crater_diameter, 2),
        "Tsunami Risk": tsunami,
        "Seismic Event": seismic
    }
    return result

@app.route("/simulate", methods=["POST"])
def simulate():
    data = request.get_json()
    diameter = float(data.get("diameter", 50))  # meters
    velocity = float(data.get("velocity", 16))  # km/s
    result = simulate_impact(diameter, velocity)
    return jsonify(result)

if __name__ == "__main__":
    import os
    port = int(os.environ.get("PORT", 10000))  # Render dynamic port
    app.run(host="0.0.0.0", port=port)









