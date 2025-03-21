"use client";

import { useState } from "react";
import NewCoordinatesMap from "@/components/maps/map-new-coordinates";
import ButtonSave from "@/components/buttons/dynamic/icons-save";
import { guardarObra } from "@/actions/obras-actions";
import toasterCustom from "@/components/toaster-custom";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/dialog/dialog-confirm";
import medidaTotal from "@/utils/measureWork";
import FormularioRegisterObra from "@/components/forms/form-obra";

function ObrasContainer() {
  const [points, setPoints] = useState<[number, number][]>([]);
  const [projectType, setProjectType] = useState<string>("");
  const [workData, setWorkData] = useState<{
    cui: string;
    nombreObra: string;
    fecha: Date | null;
    presupuesto: string;
    obraType: string;
  }>({
    cui: "",
    nombreObra: "",
    fecha: null,
    presupuesto: "",
    obraType: "",
  });

  const defaultLocation = {
    latitude: -12.046451,
    longitude: -77.043167,
  };

  const [showConfirmationModal, setShowConfirmationModal] =
    useState<boolean>(false);
  // Store the form reset function
  const [formResetFn, setFormResetFn] = useState<(() => void) | null>(null);

  const handleSaveClick = async () => {
    if (
      !workData.cui ||
      !workData.nombreObra ||
      !workData.obraType ||
      !workData.presupuesto
    ) {
      toasterCustom(400, "Faltan datos en el formulario.");
      return;
    }

    if (workData.fecha === null) {
      toasterCustom(400, "Debe seleccionar una fecha válida.");
      return;
    }

    if (points.length < 3) {
      toasterCustom(
        400,
        "Por favor, introduce al menos 3 puntos para continuar."
      );
      return;
    }

    handleShowConfirmationModal();
  };

  const handleShowConfirmationModal = () => setShowConfirmationModal(true);
  const handleCloseConfirmationModal = () => setShowConfirmationModal(false);

  const handleConfirmSave = async () => {
    if (!formResetFn) return;

    const areaOrLength = medidaTotal(points, projectType);
    try {
      const data = await guardarObra(projectType, points, areaOrLength, {
        ...workData,
        fecha: workData.fecha as Date,
      });

      if (!data) {
        toasterCustom(500, "Ocurrió un error inesperado");
        return;
      }

      toast.dismiss();
      toasterCustom(data.status, data.message);
      handleCloseConfirmationModal();

      if (data.status === 200) {
        setPoints([]);
        setProjectType("");
        setWorkData({
          cui: "",
          nombreObra: "",
          fecha: null,
          presupuesto: "",
          obraType: "",
        });
        formResetFn(); // Call the stored reset function
      }
    } catch {
      toasterCustom(500, "Error al procesar la solicitud.");
    }
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="grid sm:grid-row-1 md:grid-cols-[1fr_auto] items-center gap-4">
        <div className="h-full">
          <FormularioRegisterObra
            setWorkData={setWorkData}
            workData={workData}
            setFormResetFn={setFormResetFn} // Pass setter for reset function
          />
        </div>

        <ButtonSave onClick={handleSaveClick} />
      </div>

      <div className="rounded-3xl overflow-hidden w-full h-full shadow-lg">
        <NewCoordinatesMap
          points={points}
          setPoints={setPoints}
          setProjectTypestyle={setProjectType}
          defaultLocation={defaultLocation}
        />
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