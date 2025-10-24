import requests

def get_seismic_data(lat, lng):
    url = f"https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"
    response = requests.get(url)
    if response.status_code != 200:
        return None
    data = response.json()
    # Simplified: return the first earthquake
    return data['features'][0] if data['features'] else None



