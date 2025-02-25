"use client";

import { useEffect, useState, useRef } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import Map, { NavigationControl, ViewState } from "react-map-gl";
import LocationObras from "../views/location-works";
import MapStylePreview from "./map-style";

interface Obra {
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

interface ObrasProps {
  obrasT: Obra[];
  defaultLocation: UserLocation;
}

export default function CustomMap({ obrasT, defaultLocation }: ObrasProps) {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  const [styleLoaded, setStyleLoaded] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState("mapbox://styles/mapbox/standard");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [viewState, setViewState] = useState<ViewState>({
    latitude: defaultLocation.latitude,
    longitude: defaultLocation.longitude,
    zoom: 14,
    bearing: 0,
    pitch: 0,
    padding: { top: 0, right: 0, bottom: 0, left: 0 },
  });
  const [containerSize, setContainerSize] = useState<{ width: number; height: number }>({
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

  // Lista de estilos disponibles
  const styles = [
    { label: "3D", url: "mapbox://styles/mapbox/standard" },
    { label: "Satelital", url: "mapbox://styles/mapbox/satellite-streets-v11" },
    { label: "Relieve", url: "mapbox://styles/mapbox/outdoors-v11" },
  ];

  // Obtenemos el objeto del estilo seleccionado para mostrar su etiqueta
  const selectedStyleObj = styles.find((s) => s.url === selectedStyle) || styles[0];

  return (
    <div className="w-full h-full">
      {/* Contenedor para la selección de estilo (dropdown) */}
      <div
        className="absolute z-10"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          padding: 8,
        }}
      >
        {!dropdownOpen ? (
          // Al presionar el estilo seleccionado se abre el desplegable
          <div onClick={() => setDropdownOpen(true)}>
            <MapStylePreview
              key="selected"
              styleUrl={selectedStyleObj.url}
              name={selectedStyleObj.label}
              isActive={true}
              onSelect={() => {}} // No se requiere acción adicional
              defaultLocation={defaultLocation}
            />
          </div>
        ) : (
          // Se muestran las 3 vistas previas para elegir el estilo
          <div style={{ display: "flex", gap: 8 }}>
            {styles.map((style, index) => (
              <MapStylePreview
                key={index}
                styleUrl={style.url}
                name={style.label}
                isActive={selectedStyle === style.url}
                onSelect={() => {
                  setSelectedStyle(style.url);
                  setDropdownOpen(false);
                }}
                defaultLocation={defaultLocation}
              />
            ))}
          </div>
        )}
      </div>

      {/* Contenedor del mapa principal */}
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
