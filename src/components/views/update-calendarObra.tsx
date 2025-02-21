import { useState } from "react";
import { Button } from "../buttons/button";
import CalendarCustom from "./calendar-custom";
import { ConfirmDialog } from "../dialog/dialog-confirm";
import { ActualizarCalendarObra } from "@/actions/details-action";
import toasterCustom from "../toaster-custom";

interface CalendarObraProps {
  setModalFecha: (value: boolean) => void;
  id: string;
  fecha: string;
}

function CalendarObra({ setModalFecha, id, fecha }: CalendarObraProps) {
  const [day, setDay] = useState<string | undefined>("");
  const [showConfirmationModal, setShowConfirmationModal] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const formattedFecha =
    fecha && !isNaN(Date.parse(fecha))
      ? new Date(fecha).toISOString().split("T")[0]
      : "";

  const handleMensajeGuardar = () => {
    if (!day) {
      toasterCustom(400, "Por favor, seleccione una fecha antes de continuar.");
      return;
    }

    const fechaSeleccionada = new Date(day);
    const fechaActual = new Date();

    if (fechaSeleccionada < fechaActual) {
      toasterCustom(
        400,
        "La fecha seleccionada no puede ser anterior a la fecha actual."
      );
      return;
    }

    setShowConfirmationModal(true);
  };

  const handleClosedModal = () => {
    setShowConfirmationModal(false);
  };

  const confirmationModal = async () => {
    if (day) {
      setIsLoading(true);
      try {
        const fechaFinal = new Date(day);
        const response = await ActualizarCalendarObra(id, fechaFinal);
        if (response.status === 200) {
          toasterCustom(response.status, response.message);
          setShowConfirmationModal(false);
          setModalFecha(false);
          window.location.reload();
        } else {
          toasterCustom(response.status, response.message);
        }
      } catch {
        toasterCustom(
          500,
          "Ocurrió un error al actualizar la fecha de la obra."
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  const closeModal = () => {
    setModalFecha(false);
  };

  return (
    <div className="bg-background p-6 rounded-lg w-full sm:w-3/4 lg:w-1/2 max-w-sm sm:max-w-lg space-y-6 px-4 z-20">
      <div className="dark:bg-gray-800 bg-slate-200 rounded-3xl">
        <CalendarCustom
          Daysworked={formattedFecha ? [formattedFecha] : []}
          setDay={setDay}
        />
      </div>
      <div className="flex justify-center space-x-8">
        <Button
          className="bg-gray-600 hover:bg-gray-500 text-white"
          onClick={closeModal}
        >
          Cerrar
        </Button>
        <Button
          className="bg-blue-500 hover:bg-blue-400"
          onClick={handleMensajeGuardar}
          disabled={isLoading}
        >
          {isLoading ? "Actualizando..." : "Actualizar"}
        </Button>
      </div>
      <ConfirmDialog
        isOpen={showConfirmationModal}
        onClose={handleClosedModal}
        onConfirm={confirmationModal}
        title="¿Estás seguro de que deseas actualizar la fecha de esta obra?"
        description="Una vez actualizada la fecha, no habrá vuelta atrás."
        styleButton="bg-blue-500 hover:bg-blue-400"
      />
    </div>
  );
}

export default CalendarObra;
