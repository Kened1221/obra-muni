"use client";

import Map from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

interface MapStylePreviewProps {
  styleUrl: string;
  name: string;
  isActive: boolean;
  onSelect: () => void;
  defaultLocation: { latitude: number; longitude: number };
}

export default function MapStylePreview({
  styleUrl,
  name,
  isActive,
  onSelect,
  defaultLocation,
}: MapStylePreviewProps) {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  const previewViewState = {
    latitude: defaultLocation.latitude,
    longitude: defaultLocation.longitude,
    zoom: 12,
    bearing: 0,
    pitch: 0,
  };

  return (
    <div
      onClick={onSelect}
      className={`border-${
        isActive ? "4" : "1"
      } border-blue-500 rounded-lg cursor-pointer`}
    >
      <div className="absolute px-2 text-center justify-center font-bold text-gray-900 z-10">
        {name}
      </div>
      <Map
        mapboxAccessToken={token}
        initialViewState={previewViewState}
        mapStyle={styleUrl}
        style={{ width: 150, height: 100 }}
        attributionControl={false}
        interactive={false}
      />
    </div>
  );
}
