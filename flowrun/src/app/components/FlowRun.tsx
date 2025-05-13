import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import { LatLngExpression } from "leaflet";
import dynamic from "next/dynamic";

// Set up the OpenRouteService API URL and API Key
const OPENROUTESERVICE_URL = "https://api.openrouteservice.org/v2/directions/driving-car";
const API_KEY = "5b3ce3597851110001cf6248187f0f935de94c7f9678919be23eaabf"; // Replace with your actual API key

const FlowRun = () => {
  const [route, setRoute] = useState<any>(null);
  const [avoidUnpaved, setAvoidUnpaved] = useState(false);
  const [distance, setDistance] = useState(5000); // Default to 5 km

  const location: LatLngExpression = [55.70488452849846, 12.56211994294561]; // Your starting point

  // Function to generate the route
  const generateRoute = async () => {
    const start = [12.56211994294561, 55.70488452849846]; // [lng, lat]
    const end = [12.57211994294561, 55.70488452849846];   // A nearby point for now
  
    const requestBody = {
      coordinates: [start, end],
      instructions: false,
    };
  
    try {
      const response = await fetch("https://api.openrouteservice.org/v2/directions/foot-walking/geojson", {
        method: "POST",
        headers: {
          Authorization: API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
  
      const data = await response.json();
  
      if (data && data.features && data.features[0]) {
        const routeCoords = data.features[0].geometry.coordinates;
        setRoute(routeCoords); // Keep [lng, lat] order
      } else {
        console.warn("No route returned", data);
      }
    } catch (error) {
      console.error("Error generating route:", error);
    }
  };
  
  

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      {/* UI controls */}
      <div
  className="controls"
        style={{
            backgroundColor: "#fff",
            padding: "16px",
            borderRadius: "8px",
            marginBottom: "20px",
            color: "#000",
        }}
>
        <label style={{ display: "block", marginBottom: "10px" }}>
          Avoid unpaved roads:
          <input
            type="checkbox"
            checked={avoidUnpaved}
            onChange={() => setAvoidUnpaved(!avoidUnpaved)}
            style={{ marginLeft: "10px" }}
          />
        </label>

        <label style={{ display: "block", marginBottom: "10px" }}>
          Distance (km):
          <input
            type="number"
            value={distance / 1000} // Convert meters to km
            onChange={(e) => setDistance(Number(e.target.value) * 1000)} // Convert back to meters
            min={1}
            style={{ marginLeft: "10px" }}
          />
        </label>

        <button onClick={generateRoute} style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer" }}>
          Generate Route
        </button>
      </div>

      {/* Map */}
      <MapContainer
        center={location}
        zoom={13}
        style={{ height: "500px", width: "80%", border: "2px solid #ccc" }} // Adjust map size and add border
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
        />

        <Marker position={location}>
          <Popup>Starting Point</Popup>
        </Marker>

        {/* Display the route if it exists */}
        {route && (
          <Polyline positions={route.map(([lng, lat]: [number, number]) => [lat, lng])} color="blue" />
        )}
      </MapContainer>
    </div>
  );
};

export default dynamic(() => Promise.resolve(FlowRun), { ssr: false });
