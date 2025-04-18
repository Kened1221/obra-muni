// import Link from "next/link";

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
interface ObraDetailsProps {
  obra?: obra;
}

export function ObraDetails({ obra }: ObraDetailsProps) {
  if (!obra) {
    return <p className="text-white text-center">No hay obra seleccionada</p>;
  }

  return (
    <div className="w-full h-full text-sm">
      <div className="space-y-3 text-start">
        <div>
          <strong className="font-bold text-justify">
            Descripción del Proyecto:
          </strong>
          <p className="leading-relaxed dark:text-gray-200">{obra.name}</p>
        </div>
        <div>
          <strong className="font-bold">CUI:</strong>{" "}
          <span className="dark:text-gray-200">{obra.cui}</span>
        </div>
        <div>
          <strong className="font-bold">Proyecto:</strong>{" "}
          <span className="dark:text-gray-200">{obra.obraType}</span>
        </div>
        <div>
          <strong className="font-bold">Medida Aproximada: </strong>{" "}
          <span className="dark:text-gray-200">{obra.areaOrLength}</span>
        </div>
        <div>
          <strong className="font-bold">Estado: </strong>
          <span className="dark:text-gray-200">{obra.state}</span>
        </div>
        <div>
          <strong className="font-bold">Supervisor: </strong>{" "}
          <span className="dark:text-gray-200">{obra.supervisor}</span>
        </div>
        <div>
          <strong className="font-bold">Residente:</strong>{" "}
          <span className="dark:text-gray-200">{obra.resident}</span>
        </div>
      </div>
    </div>
  );
}
