/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useParams } from "next/navigation";
import DetallesContainer from "./detalles-container";
import ImagesContainer from "./images-container";
import { obtenerDetalles } from "@/actions/details-action";
import { getDaysWorked } from "@/actions/img-actions";
import { useEffect, useState } from "react";

interface Obra {
  id: string;
  state: string;
  propietario_id: string | null;
  resident: string | null;
  supervisor: string | null;
  projectType: string;
  obraType: string;
  cui: string;
  name: string;
  presupuesto: string;
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
  date: Date;
}

function Page() {
  const { id } = useParams();
  const [obra, setObra] = useState<Obra | null>(null);
  const [img, setImg] = useState<imgs[]>([]);

  const fetchData = async () => {
    if (!id) return;

    const idOnly = id?.toString();
    const data = await obtenerDetalles(idOnly);
    setObra(data);

    if (data && data.cui) {
      const imgs = await getDaysWorked(data.cui);
      setImg(imgs);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // Agregué 'id' como dependencia

  const type_points_obra = obra
    ? {
      projectType: obra.projectType,
      points: obra.points,
    }
    : null;


  return (
    <div className="grid grid-cols-1 md:grid-cols-2 h-full w-full gap-4">
      <div className="h-full">
        <ImagesContainer imgs={img} type_points_obra={type_points_obra} />
      </div>
      <div className="h-full">
        {obra && <DetallesContainer obraDetalles={obra}/>}
      </div>
    </div>
  );
}

export default Page;