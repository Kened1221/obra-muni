"use server";

import { prisma } from "@/lib/prisma";

export async function crearProyecto(proyecto: {
  cui: string;
  nombreObra: string;
  resident: string;
  propietarioId: string;
  fecha: string;
}) {
  try {
    await prisma.project.create({
      data: {
        cui: proyecto.cui,
        nombreObra: proyecto.nombreObra,
        resident: proyecto.resident,
        propietarioId: proyecto.propietarioId,
        dateFinal: proyecto.fecha,
      },
    });
    return { status: 200, message: "Proyecto creado exitosamente" };
  } catch (error) {
    console.error(error);
    return null;
  }
}
