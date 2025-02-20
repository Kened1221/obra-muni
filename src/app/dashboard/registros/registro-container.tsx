"use client";

import NewCoordinates from "@/components/views/register-Location";
import { useState } from "react";
import ButtonSave from "@/components/buttons/dynamic/icons-save";
import { guardarObra } from "@/actions/obras-actions";
import toasterCustom from "@/components/toaster-custom";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/dialog/dialog-confirm";
import medidaTotal from "@/utils/measureWork";
import { ChevronDown, ChevronUp } from "lucide-react";
import FormularioRegisterObra from "@/components/forms/form-obra";

function ObrasContainer() {
  const [points, setPoints] = useState<[number, number][]>([]);
  const [projectType, setProjectType] = useState<string>("");

  const [workData, setworkData] = useState<{
    cui: string;
    nombreObra: string;
    fecha: Date;
    obraType: string;
  }>({
    cui: "",
    nombreObra: "",
    fecha: new Date(),
    obraType: "",
  });

  const [showConfirmationModal, setShowConfirmationModal] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleSaveClick = async () => {
    if (points.length < 3) {
      toasterCustom(400, "Por favor, introduce al menos 3 puntos para continuar.");
      return;
    }

    if (!workData.cui || !workData.nombreObra || !workData.obraType) {
      toasterCustom(400, "Faltan datos en el formulario.");
      return;
    }

    handleShowConfirmationModal();
  };

  const handleShowConfirmationModal = () => setShowConfirmationModal(true);
  const handleCloseConfirmationModal = () => setShowConfirmationModal(false);

  const handleConfirmSave = async () => {
    if (points.length < 3) {
      toasterCustom(400, "El polígono debe tener al menos 3 puntos válidos.");
      return;
    }

    const areaOrLength = medidaTotal(points, projectType);
    const { cui, nombreObra, obraType, fecha } = workData;

    if (!cui || !nombreObra || !obraType || !fecha) {
      toasterCustom(400, "Faltan datos en el formulario.");
      return;
    }

    try {
      const fechaFinal = new Date(fecha);
      const data = await guardarObra(
        projectType,
        points,
        areaOrLength,
        obraType,
        cui,
        nombreObra,
        fechaFinal
      );

      if (!data) {
        toasterCustom(500, "Ocurrió un error inesperado");
        return;
      }

      toast.dismiss();
      toasterCustom(data.status, data.message);
      handleCloseConfirmationModal();

      if (data.status === 200) {
        setTimeout(() => {
          window.location.reload();
        }, 0);
      }
    } catch {
      toasterCustom(500, "Error al procesar la solicitud.");
    }
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="grid sm:grid-row-1 md:grid-cols-[1fr_auto] items-center gap-4">
        <div className="relative w-full">
          <button
            className="flex items-center justify-between w-full px-4 py-2 bg-background rounded-lg border-border border-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span>Registrar obra</span>
            {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          {isOpen && (
            <div className="absolute z-50 w-full bg-background border rounded-lg shadow-md mt-2 p-4">
              <FormularioRegisterObra setworkData={setworkData} workData={workData} />
            </div>
          )}
        </div>

        <ButtonSave onClick={handleSaveClick} />
      </div>

      <div className="rounded-3xl overflow-hidden w-full h-full shadow-lg">
        <NewCoordinates setPoints={setPoints} setProjectTypestyle={setProjectType} />
      </div>

      <ConfirmDialog
        isOpen={showConfirmationModal}
        onClose={handleCloseConfirmationModal}
        onConfirm={handleConfirmSave}
        title="¿Estás seguro de guardar esta información?"
        description="Los datos guardados incluirán nombres y coordenadas"
        styleButton="bg-green-500 hover:bg-emerald-500"
      />
    </div>
  );
}

export default ObrasContainer;
