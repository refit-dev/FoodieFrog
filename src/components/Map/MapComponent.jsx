"use client";

import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { useState } from "react";

const containerStyle = {
  width: "100%",
  height: "400px",
};

export default function MapComponent( { markerPosition } ) {
  const [position, setPosition] = useState(markerPosition);

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
      <GoogleMap mapContainerStyle={containerStyle} center={markerPosition} zoom={12}>
        <Marker position={markerPosition} />
      </GoogleMap>
    </LoadScript>
  );
}
