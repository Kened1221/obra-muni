"use client";

import {
  FaBarcode,
  FaCogs,
  FaUserAlt,
  FaChartArea,
  FaHeartbeat,
  FaHeartBroken,
} from "react-icons/fa";

import { IoIosSend } from "react-icons/io";

import { useRouter } from "next/navigation";
import { Button } from "../buttons/button";
import toasterCustom from "../toaster-custom";
import { useState } from "react";
import { ConfirmDialog } from "../dialog/dialog-confirm";
import * as motion from "motion/react-client";
import { FinalizarObra } from "@/actions/details-action";

interface obra {
  id: string;
  state: string;
  propietario_id: string | null;
  resident: string | null;
  projectType: string;
  obraType: string;
  cui: string;
  name: string;
  areaOrLength: string;
  fechaFinal: string;
  porcentaje: number;
}

function DescriptionWork({ obra }: { obra: obra }) {
  const [showConfirmationModalF, setShowConfirmationModalF] =
    useState<boolean>(false);

  const router = useRouter();

  const handlemensajeFinalizar = () => {
    setShowConfirmationModalF(true);
  };

  const handleFinalizarConfirmationModal = () => {
    setShowConfirmationModalF(false);
  };

  const confirmationFinalizar = async () => {
    try {
      const response = await FinalizarObra(obra.id);

      toasterCustom(response.status, response.message);

      router.push("/dashboard");
    } catch {
      toasterCustom(400, "Error al finalizar la obra");
    }
  };

  return (
    <div className="flex flex-col justify-center h-full p-6 gap-2 bg-white dark:bg-gray-800 shadow-lg">
      <p className="font-bold text-gray-900 dark:text-white text-justify p-4 text-sm">
        {obra.name}
      </p>
      <div className="grid grid-cols-1">
        <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
          <FaCogs className="text-lg text-blue-500" />
          <p className="font-medium">Tipo de Proyecto:</p>
          <span>{obra.obraType}</span>
        </div>

        <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
          <FaBarcode className="text-lg text-green-500" />
          <p className="font-medium">CUI:</p>
          <span>{obra.cui}</span>
        </div>

        <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
          <FaUserAlt className="text-lg text-yellow-500" />
          <p className="font-medium">Residente:</p>
          <span>{obra.resident}</span>
        </div>

        <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
          <FaChartArea className="text-lg text-purple-500" />
          <p className="font-medium">Medida Aproximada:</p>
          <span>{obra.areaOrLength}</span>
        </div>

        <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
          {obra.state === "Ejecucion" ? (
            <>
              <FaHeartbeat className="text-lg text-green-500" />
              <p className="font-medium">Estado:</p>
              <span>En {obra.state}</span>
            </>
          ) : (
            <>
              <FaHeartBroken className="text-lg text-red-500" />
              <p className="font-medium">Estado:</p>
              <span>{obra.state}</span>
            </>
          )}
        </div>
      </div>
      <div className="flex justify-center flex-col md:flex-row sm:justify-end h-screem h-full items-center space-x-2">
        <div className="flex relative bg-slate-300 w-full h-[25px] rounded-full overflow-hidden z-0">
          <motion.div
            initial={{
              width: "0%",
            }}
            animate={{
              width: `${obra.porcentaje}%`,
            }}
            transition={{
              duration: 2,
            }}
            className="absolute top-0 left-0 h-full bg-green-400"
          ></motion.div>

          <p className="absolute top-0 left-0 w-full h-full flex items-center justify-center font-bold z-10">
            {obra.porcentaje} %
          </p>
        </div>
        <div className="flex justify-center items-center space-x-6 py-4">
          {obra.porcentaje === 100 ||
            (obra.state !== "Ejecucion" && (
              <Button
                onClick={handlemensajeFinalizar}
                className="bg-fuchsia-900 hover:bg-fuchsia-700"
              >
                <IoIosSend /> Finalizar
              </Button>
            ))}
        </div>
      </div>

      <ConfirmDialog
        isOpen={showConfirmationModalF}
        onClose={handleFinalizarConfirmationModal}
        onConfirm={confirmationFinalizar}
        title="¿Estas seguro de desea Finalizar esta obra?"
        description="Una vez finalizado la obra no habra vuelta atras"
        styleButton="bg-fuchsia-900 hover:bg-fuchsia-700"
      />
    </div>
  );
}

export default DescriptionWork;
