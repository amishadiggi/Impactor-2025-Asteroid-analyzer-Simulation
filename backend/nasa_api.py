import requests

NASA_API_KEY = "DEMO_KEY"  # Replace with your own key

def get_asteroid_data(neo_id):
    url = f"https://api.nasa.gov/neo/rest/v1/neo/{neo_id}?api_key={NASA_API_KEY}"
    response = requests.get(url)
    if response.status_code != 200:
        return None
    data = response.json()
    diameter = data["estimated_diameter"]["meters"]["estimated_diameter_max"]
    velocity = float(data["close_approach_data"][0]["relative_velocity"]["kilometers_per_second"])
    miss_distance = float(data["close_approach_data"][0]["miss_distance"]["kilometers"])
    return {
        "diameter": diameter,
        "velocity": velocity,
        "miss_distance": miss_distance
    }

 



