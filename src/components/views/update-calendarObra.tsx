import { Button } from "../buttons/button";
import CalendarCustom from "./calendar-custom";
import { ConfirmDialog } from "../dialog/dialog-confirm";
import {
  ActualizarCalendarObra,
  estadoObra,
  FinalizarObra,
} from "@/actions/details-action";
import toasterCustom from "../toaster-custom";
import { useState, useEffect, useCallback } from "react";
import { IoIosSend } from "react-icons/io";

interface CalendarObraProps {
  setModalFecha: (value: boolean) => void;
  id: string;
  fecha: string;
}

interface DateFinal {
  id: string;
  state: string;
  porcentaje: number;
}

function CalendarObra({ setModalFecha, id, fecha }: CalendarObraProps) {
  const [day, setDay] = useState<string>("");
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [date, setDate] = useState<DateFinal | null>(null);
  const [showConfirmationModalF, setShowConfirmationModalF] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await estadoObra(id);
        setDate(data);
      } catch (error) {
        console.error("Error obteniendo obra:", error);
      }
    };
    fetchData();
  }, [id]);

  const handleMensajeGuardar = useCallback(() => {
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
  }, [day]);

  const confirmationModal = useCallback(async () => {
    if (!day) return;
    setIsLoading(true);
    try {
      const fechaFinal = new Date(day);
      const response = await ActualizarCalendarObra(id, fechaFinal);
      if (response.status === 200) {
        toasterCustom(response.status, response.message);
        setShowConfirmationModal(false);
        setModalFecha(false);
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else {
        toasterCustom(response.status, response.message);
      }
    } catch {
      toasterCustom(500, "Ocurrió un error al actualizar la fecha de la obra.");
    } finally {
      setIsLoading(false);
    }
  }, [day, id, setModalFecha]);

  const closeModal = useCallback(() => {
    setModalFecha(false);
  }, [setModalFecha]);

  const handleMensajeFinalizar = useCallback(() => {
    setShowConfirmationModalF(true);
  }, []);

  const handleFinalizarConfirmationModal = useCallback(() => {
    setShowConfirmationModalF(false);
  }, []);

  const confirmationFinalizar = useCallback(async () => {
    if (!date || !date.id) {
      toasterCustom(400, "No se encontró la obra para finalizar.");
      return;
    }
    setIsFinalizing(true);
    try {
      const response = await FinalizarObra(date.id);
      if (response.status === 200) {
        toasterCustom(response.status, response.message);
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else {
        toasterCustom(400, "Error eliminando la obra");
      }
    } catch {
      toasterCustom(400, "Error al finalizar la obra");
    } finally {
      setIsFinalizing(false);
    }
  }, [date]);

  return (
    <div className="bg-background p-6 rounded-lg w-full sm:w-3/4 lg:w-1/2 max-w-sm sm:max-w-lg space-y-6 px-4 z-20">
      <div className="dark:bg-gray-800 bg-slate-200 rounded-3xl">
        <CalendarCustom Daysworked={[fecha + "T00:00"]} setDay={setDay} />
      </div>
      <div className="flex justify-center space-x-8">
        <Button
          className="bg-gray-600 hover:bg-gray-500 text-white"
          onClick={closeModal}
        >
          Cerrar
        </Button>
        {date && date.porcentaje === 100 && date.state === "Ejecucion" && (
          <Button
            onClick={handleMensajeFinalizar}
            className="bg-fuchsia-900 hover:bg-fuchsia-700"
            disabled={isFinalizing}
          >
            <IoIosSend /> {isFinalizing ? "Finalizando..." : "Finalizar"}
          </Button>
        )}
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
        onClose={() => setShowConfirmationModal(false)}
        onConfirm={confirmationModal}
        title="¿Estás seguro de que deseas actualizar la fecha de esta obra?"
        description="Una vez actualizada la fecha, no habrá vuelta atrás."
        styleButton="bg-blue-500 hover:bg-blue-400"
      />
      <ConfirmDialog
        isOpen={showConfirmationModalF}
        onClose={handleFinalizarConfirmationModal}
        onConfirm={confirmationFinalizar}
        title="¿Estás seguro de que deseas finalizar esta obra?"
        description="Una vez finalizada la obra, no habrá vuelta atrás."
        styleButton="bg-fuchsia-900 hover:bg-fuchsia-700"
      />
    </div>
  );
}

export default CalendarObra;
