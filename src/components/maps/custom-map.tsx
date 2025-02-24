"use client";

import { useEffect, useState, useRef } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import Map, { NavigationControl, ViewState } from "react-map-gl";
import LocationObras from "../views/location-works";

interface obra {
  id: string;
  state: string;
  propietario_id: string;
  resident: string;
  projectType: string;
  obraType: string;
  cui: string;
  name: string;
  areaOrLength: string;
  points: [number, number][];
  fechaFinal: string;
}

interface UserLocation {
  latitude: number;
  longitude: number;
}

interface obrasProps {
  obrasT: obra[];
  defaultLocation: UserLocation;
}

function CustomMap({ obrasT, defaultLocation }: obrasProps) {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  const [styleLoaded, setStyleLoaded] = useState(false);

  const [selectedStyle, setSelectedStyle] = useState(
    "mapbox://styles/mapbox/standard"
  );

  const [viewState, setViewState] = useState<ViewState>({
    latitude: defaultLocation.latitude,
    longitude: defaultLocation.longitude,
    zoom: 14,
    bearing: 0,
    pitch: 0,
    padding: { top: 0, right: 0, bottom: 0, left: 0 },
  });

  const [containerSize, setContainerSize] = useState<{
    width: number;
    height: number;
  }>({
    width: 0,
    height: 0,
  });

  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setViewState((prevState) => ({
      ...prevState,
      latitude: defaultLocation.latitude,
      longitude: defaultLocation.longitude,
      transitionDuration: 1000,
      transitionEasing: (t: number) => t,
    }));
  }, [defaultLocation]);

  useEffect(() => {
    if (mapContainerRef.current) {
      const { width, height } = mapContainerRef.current.getBoundingClientRect();
      setContainerSize({ width, height });
    }
  }, []);

  const handleStyleLoad = () => {
    setStyleLoaded(true);
  };

  return (
    <div ref={mapContainerRef} className="w-full h-full">
      <div className="absolute p-4 z-10">
        <select
          id="mapStyle"
          value={selectedStyle}
          onChange={(e) => setSelectedStyle(e.target.value)}
          className="border p-1 rounded bg-background"
        >
          <option value="mapbox://styles/mapbox/standard">3D</option>
          <option value="mapbox://styles/mapbox/satellite-streets-v11">
            Satelital
          </option>
          <option value="mapbox://styles/mapbox/outdoors-v11">Relieve</option>
        </select>
      </div>

      <div ref={mapContainerRef} className="w-full h-full">
        <Map
          mapboxAccessToken={token}
          viewState={{
            ...viewState,
            width: containerSize.width,
            height: containerSize.height,
          }}
          onMove={(evt) => setViewState(evt.viewState)}
          attributionControl={false}
          mapStyle={selectedStyle}
          onLoad={handleStyleLoad}
          logoPosition="top-right"
        >
          {styleLoaded && (
            <>
              <NavigationControl
                position="bottom-right"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  padding: "10px",
                  gap: "10px",
                  borderRadius: "15px",
                }}
              />
              {obrasT.map((obra, index) => (
                <LocationObras key={index} obra={obra} />
              ))}
            </>
          )}
        </Map>
      </div>
    </div>
  );
}

export default CustomMap;
