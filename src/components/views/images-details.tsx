/* eslint-disable @next/next/no-img-element */

import { useSession } from "next-auth/react";
import MapLocationPhoto from "../maps/map-location-photo";

interface ImgProps {
  id: string;
  url: string;
  latitud: string | null;
  longitud: string | null;
  propietario_id: string;
  date: Date;
}

interface LocationObra {
  projectType: string;
  points: [number, number][];
}

interface ImageDetallesProps {
  selectedImage: ImgProps;
  type_points_obra: LocationObra | null;
  closeModal: () => void;
}

function ImageDetalles({
  selectedImage,
  type_points_obra,
  closeModal,
}: ImageDetallesProps) {
  const latitude = selectedImage.latitud
    ? parseFloat(selectedImage.latitud)
    : null;
  const longitude = selectedImage.longitud
    ? parseFloat(selectedImage.longitud)
    : null;

  const date = new Date(selectedImage.date);

  const formattedDate = date.toLocaleString();
  const { status } = useSession();


  return (
    <>
      {status === "authenticated" ? (
        <div className="bg-white dark:bg-background p-6 rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
          <h2 className="text-xl text-center font-semibold text-gray-800 dark:text-gray-200 pb-4">
            Detalles de la Imagen
          </h2>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/2">
              <img
                src={selectedImage.url}
                alt={selectedImage.id}
                className="w-full h-52 md:h-64 object-cover rounded-md mb-3"
              />
              <div className="space-y-3">
                <p className="text-gray-600 dark:text-gray-300">
                  <strong>Latitud:</strong> {latitude ?? "No disponible"}
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  <strong>Longitud:</strong> {longitude ?? "No disponible"}
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  <strong>Fecha:</strong> {formattedDate}
                </p>
              </div>
            </div>

            <div className="w-full md:w-1/2 flex justify-center items-center">
              {latitude !== null && longitude !== null ? (
                <div className="w-full h-[250px] md:h-full min-w-[200px] min-h-[250px] rounded-lg overflow-hidden">
                  <MapLocationPhoto
                    longitude={longitude}
                    latitude={latitude}
                    type_points_obra={type_points_obra}
                  />
                </div>
              ) : (
                <p className="text-gray-500 text-center">
                  📍 Ubicación no disponible
                </p>
              )}
            </div>
          </div>

          <button
            onClick={closeModal}
            className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md"
          >
            Cerrar
          </button>
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <div className="flex flex-col dark:bg-background px-6 rounded-lg shadow-lg w-full h-full overflow-y-auto relative">
            <button
              onClick={closeModal}
              aria-label="Cerrar modal"
              className="absolute right-4 top-0 mt-4 flex items-center justify-center w-10 h-10 text-4xl font-extrabold hover:text-red-700"
            >
              &times;
            </button>
            <h2 className="text-xl text-center font-semibold text-gray-800 dark:text-gray-200 pt-4">
              Detalles de la Imagen
            </h2>
            <div className="flex flex-col items-center justify-center w-full h-full md:flex-row gap-4 p-4">
              <div className="h-full">
                <img
                  src={selectedImage.url}
                  alt={selectedImage.id}
                  className="w-full h-full  object-cover rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ImageDetalles;
