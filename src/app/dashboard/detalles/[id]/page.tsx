"use client";
import { useParams } from "next/navigation";
import DetallesContainer from "./detalles-container";
import ImagesContainer from "./images-container";
import { obtenerDetalles } from "@/actions/details-action";
import { getDaysWorked } from "@/actions/img-actions";
import { useEffect, useState } from "react";

interface obra {
  id: string;
  state: string;
  propietario_id: string;
  resident: string;
  projectType: string;
  cui: string;
  name: string;
  areaOrLength: string;
  points: [number, number][];
  fechaFinal: string;
  porcentaje: number;
}

interface imgs {
  id: string;
  url: string;
  latitud: string | null;
  longitud: string | null;
  propietario_id: string;
  date: string;
}

function Page() {
  const { id } = useParams();
  const [obra, setObra] = useState<obra | null>(null);
  const [img, setImg] = useState<imgs[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (id && typeof id === "string") {
        const data = await obtenerDetalles(id);
        setObra(data);

        if (data && data.propietario_id) {
          const imgs = await getDaysWorked(data.propietario_id);
          setImg(imgs);
        }
      }
    };

    fetchData();
  }, [id]);

  if (!obra)
    return (
      <div className="text-center text-cyan-900 dark:text-teal-400 font-semibold">
        Cargando...
      </div>
    );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 h-full w-full gap-4">
      <div className="h-full">
        <ImagesContainer imgs={img} />
      </div>
      <div className="h-full">
        <DetallesContainer obraDetalles={obra} />
      </div>
    </div>
  );
}

export default Page;
