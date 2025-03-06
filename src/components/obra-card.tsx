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
      <div className="text-secondary-foreground text-sm text-justify space-y-3 overflow-hidden">
        <p>{obra.name}</p>
        <div>
          <strong>Tipo de proyecto:</strong>{" "}
          <span className="dark:text-gray-300">{obra.obraType}</span>
        </div>
        <div>
          <strong>Tamaño Aproximado:</strong>{" "}
          <span className="dark:text-gray-300">{obra.areaOrLength}</span>
        </div>
        <div>
          <strong>Supervisor:</strong>{" "}
          <span className="dark:text-gray-300">{obra.supervisor}</span>
        </div>
        <div>
          <strong>Residente:</strong>{" "}
          <span className="dark:text-gray-300">{obra.resident}</span>
        </div>
        <div>
          <strong>Estado:</strong>{" "}
          <span className="dark:text-gray-300">{obra.state}</span>
        </div>
        <div>
          <strong>Finalización:</strong>{" "}
          <span className="dark:text-gray-300">{obra.fechaFinal}</span>
        </div>
      </div>
    </div>
  );
}

export default ObraCard;
