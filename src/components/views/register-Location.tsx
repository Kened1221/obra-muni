/* eslint-disable react-hooks/exhaustive-deps */
import "mapbox-gl/dist/mapbox-gl.css";
import { MapMouseEvent } from "react-map-gl";
import { useState, useCallback, useEffect } from "react";
import { Feature, Polygon, LineString } from "geojson";
import ButtonBack from "@/components/buttons/dynamic/icons-back";
import Radio from "./option-figura";
import MapObras from "../maps/maps-obra";

interface UserLocation {
  latitude: number;
  longitude: number;
}

interface NewCoordinatesProps {
  setPoints: (localPoints: [number, number][]) => void;
  setProjectTypestyle: (projectType: string) => void;
}

function NewCoordinates({ setPoints, setProjectTypestyle }: NewCoordinatesProps) {
  const [polygonData, setPolygonData] = useState<Feature<Polygon> | null>(null);
  const [lineData, setLineData] = useState<Feature<LineString> | null>(null);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [typeError, setTypeError] = useState<number | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const defaultLocation: UserLocation = { latitude: -12.619648, longitude: -73.789429 };
  const [newPoints, setNewPoints] = useState<[number, number][]>([]);
  const [projectType, setProjectType] = useState<string>("Superficie");

  // ✅ Verifica que `points` tenga suficientes datos antes de crear geometría
  const createPolygon = (points: [number, number][]): Feature<Polygon> => {
    if (!points || points.length < 3) {
      return {
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: [[]], // Devuelve una estructura vacía si no hay suficientes puntos
        },
        properties: {},
      };
    }
    return {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [points.concat([points[0]])],
      },
      properties: {},
    };
  };

  const createLine = (points: [number, number][]): Feature<LineString> => {
    if (!points || points.length < 2) {
      return {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: [],
        },
        properties: {},
      };
    }
    return {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: points,
      },
      properties: {},
    };
  };

  const updateGeometryData = useCallback(
    (points: [number, number][]) => {
      if (points.length === 0) {
        setPolygonData(null);
        setLineData(null);
        return;
      }
      if (projectType === "Superficie") {
        setPolygonData(createPolygon(points));
        setLineData(null);
      } else if (projectType === "Carretera") {
        setLineData(createLine(points));
        setPolygonData(null);
      }
    },
    [projectType]
  );

  useEffect(() => {
    if (newPoints.length === 0) return; // Evita actualizar con datos vacíos
    updateGeometryData(newPoints);
    setPoints(newPoints);
    setProjectTypestyle(projectType);
  }, [newPoints, projectType, updateGeometryData]);

  // ✅ Evita agregar datos inválidos
  const handleMapClick = useCallback((event: MapMouseEvent) => {
    const { lng, lat } = event.lngLat;
    if (!lng || !lat) return;

    setNewPoints((prevPoints) => [...prevPoints, [lng, lat]]);
  }, []);

  const handleRemoveLastPoint = () => {
    setNewPoints((prevPoints) => {
      const updatedPoints = prevPoints.slice(0, -1);
      updateGeometryData(updatedPoints);
      return updatedPoints;
    });
  };

  const handleProjectTypeChange = (newType: string) => {
    setProjectType(newType);
  };

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setTypeError(0);
      setLocationError("La geolocalización no es soportada por este navegador");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });
        setTypeError(null);
        setLocationError(null);
      },
      (error) => {
        setTypeError(error.code);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError("El usuario denegó el permiso de geolocalización");
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError("La posición geográfica no está disponible");
            break;
          case error.TIMEOUT:
            setLocationError("La solicitud de geolocalización ha superado el tiempo de espera");
            break;
          default:
            setLocationError("Error desconocido al obtener la ubicación");
        }
      }
    );
  };

  useEffect(() => {
    requestLocation();

    if (typeError === null) {
      setIsClient(true);
    }

    const timeoutId = setTimeout(() => {
      if (!userLocation) {
        setUserLocation(defaultLocation);
      }
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [typeError, userLocation]);

  if (!isClient || !userLocation) {
    return (
      <div className="p-4">
        {isClient ? (
          <p className="text-center text-gray-700 dark:text-cyan-800 font-semibold">
            Esperando la ubicación del usuario...
          </p>
        ) : (
          <div className="items-center text-center text-red-500">
            <p className="font-semibold">{locationError}</p>
            <p>Se le redirigirá a una ubicación predeterminada...</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <div className="absolute top-4 left-4 z-10">
        <ButtonBack onClick={handleRemoveLastPoint} />
      </div>

      <div className="absolute top-4 right-4 z-10">
        <Radio projectType={projectType} setProjectType={handleProjectTypeChange} />
      </div>

      <MapObras
        isClient={isClient}
        userLocation={userLocation}
        defaultLocation={defaultLocation}
        newPoints={newPoints.length > 0 ? newPoints : []}
        setNewPoints={setNewPoints}
        polygonData={polygonData && polygonData.geometry.coordinates.length > 0 ? polygonData : null}
        lineData={lineData && lineData.geometry.coordinates.length > 0 ? lineData : null}
        projectType={projectType}
        handleMapClick={handleMapClick}
      />
    </div>
  );
}

export default NewCoordinates;
