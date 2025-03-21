import DescriptionWork from "@/components/views/description-work";
import MapDrawingPolygon from "@/components/maps/map-drawing-polygon";

interface obra {
  id: string;
  state: string;
  propietario_id: string | null;
  resident: string | null;
  projectType: string;
  obraType: string;
  cui: string;
  name: string;
  presupuesto: string;
  areaOrLength: string;
  fechaFinal: string;
  porcentaje: number;
  points: [number, number][];
}
interface DetallesContainerProps {
  obraDetalles: obra;
}

function DetallesContainer({ obraDetalles }: DetallesContainerProps) {

  const mapDetails = {
    id: obraDetalles.id,
    state: obraDetalles.state,
    points: obraDetalles.points,
    projectType: obraDetalles.projectType,
  };

  const descriptionDetails = {
    id: obraDetalles.id,
    state: obraDetalles.state,
    cui: obraDetalles.cui,
    name: obraDetalles.name,
    areaOrLength: obraDetalles.areaOrLength,
    resident: obraDetalles.resident,
    projectType: obraDetalles.projectType,
    obraType: obraDetalles.obraType,
    presupuesto: obraDetalles.presupuesto,
    propietario_id: obraDetalles.propietario_id,
    fechaFinal: obraDetalles.fechaFinal,
    porcentaje: obraDetalles.porcentaje,
  };



  return (
    <div className="grid grid-rows-2 h-full w-full gap-y-4">
      <div className="rounded-3xl overflow-hidden">
        <MapDrawingPolygon obra={mapDetails} />
      </div>
      <div className="rounded-3xl overflow-hidden">
        <DescriptionWork obra={descriptionDetails} />
      </div>
    </div>
  );
}

export default DetallesContainer;
