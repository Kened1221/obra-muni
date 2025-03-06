import React from "react";
import { TbMapPinShare } from "react-icons/tb";
import calculateHalfwayPoint from "@/utils/midPoint";

interface obra {
  id: string;
  state: string;
  propietario_id: string;
  resident: string | null;
  supervisor: string | null;
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

interface obrasProsp {
  obra: obra;
  setDefaultLocation: (location: UserLocation) => void;
}

function ObraCard({ obra, setDefaultLocation }: obrasProsp) {
  const centroid = calculateHalfwayPoint(obra.points, obra.projectType);

  const handleIconClick = () => {
    setDefaultLocation(centroid);
  };

  return (
    <div className="bg-secondary p-2 rounded-lg space-y-2">
      <div className="flex justify-between items-center w-full">
        <div className="flex-1 text-center">
          <h1 className="font-semibold">{`CUI: ${obra.cui}`}</h1>
        </div>
        <TbMapPinShare
          onClick={handleIconClick}
          className="cursor-pointer hover:text-primary"
        />
      </div>
      <p className="text-secondary-foreground text-sm text-justify">
        {obra.name}
      </p>
      <p className="text-secondary-foreground text-sm text-justify">
        Tipo de proyecto: {obra.obraType}
      </p>
      <p className="text-secondary-foreground text-sm text-justify">
        Tamaño Aproximado: {obra.areaOrLength}
      </p>
      <p className="text-secondary-foreground text-sm text-justify">
        Estado: {obra.state}
      </p>
      <p className="text-secondary-foreground text-sm text-justify">
        Supervisor: {obra.supervisor}
      </p>
      <p className="text-secondary-foreground text-sm text-justify">
        Residente: {obra.resident}
      </p>
      <p className="text-secondary-foreground text-sm text-justify">
        Finalización: {obra.fechaFinal}
      </p>
    </div>
  );
}

export default ObraCard;
