"use client";

import {
  FaBarcode,
  FaCogs,
  FaUserAlt,
  FaChartArea,
  FaHeartbeat,
  FaHeartBroken,
} from "react-icons/fa";
import { LiaMoneyBillWaveSolid } from "react-icons/lia";
import * as motion from "motion/react-client";

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
}

function DescriptionWork({ obra }: { obra: obra }) {
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
        <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
          <LiaMoneyBillWaveSolid  className="text-lg text-teal-500" />
          <p className="font-medium">Presupuesto: S/.</p>
          <span>{obra.presupuesto}</span>
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
      </div>
    </div>
  );
}

export default DescriptionWork;
