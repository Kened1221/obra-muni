/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { prisma } from "@/lib/prisma";

export async function obtenerDetalles(id: string) {
  try {
    const result = await prisma.coordinates.findMany();

    const obraEncontrada = result.find((obra: any) => obra.id === id);

    if (!obraEncontrada) {
      return null;
    }

    const tiempoTotal =
      obraEncontrada.fechaFinal.getTime() - obraEncontrada.createdAt.getTime();

    const tiempoTranscurrido =
      new Date().getTime() - obraEncontrada.createdAt.getTime();

    let porcentaje = Number(
      ((tiempoTranscurrido / tiempoTotal) * 100).toFixed(3)
    );

    if (porcentaje >= 100) {
      porcentaje = 100;
    }

    const formattedObra = {
      id: obraEncontrada.id,
      state: obraEncontrada.state,
      propietario_id: obraEncontrada.propietario_id,
      resident: obraEncontrada.resident,
      supervisor: obraEncontrada.supervisor,
      projectType: obraEncontrada.projectType,
      obraType: obraEncontrada.obraType,
      cui: obraEncontrada.cui,
      name: obraEncontrada.name,
      areaOrLength: obraEncontrada.areaOrLength,
      points: JSON.parse(obraEncontrada.points),
      fechaFinal: (() => {
        const date = new Date(obraEncontrada.fechaFinal);
        date.setUTCHours(0, 0, 0, 0);
        return date.toISOString().split("T")[0] + "T00:00";
      })(),
      porcentaje: porcentaje,
    };

    return formattedObra;
  } catch (error) {
    console.error("Error en detalles:", error);
    return null;
  }
}

export async function FinalizarObra(id: string) {
  try {
    await prisma.coordinates.update({
      where: { id: id },
      data: {
        state: "Finalizado",
      },
    });

    return {
      message: "Obra finalizada correctamente",
      status: 200,
    };
  } catch (error: unknown) {
    const errorStatus = error instanceof Error ? 500 : 400;
    return {
      message: "La obra no se pudo Finalizar",
      status: errorStatus,
    };
  }
}

export async function ActualizarObra(
  id: string,
  points: [number, number][],
  projectType: string,
  areaOrLength: string
) {
  try {
    await prisma.coordinates.update({
      where: { id: id },
      data: {
        points: JSON.stringify(points),
        projectType: projectType,
        areaOrLength: areaOrLength,
      },
    });
    return {
      message: "La obra y las coordenadas se guardaron con éxito",
      status: 200,
    };
  } catch (error: unknown) {
    const errorStatus = error instanceof Error ? 500 : 400;
    console.error("Error al actualizar la obra:", error);
    return {
      message: "La obra y las coordenadas no se puedieron guardaron",
      status: errorStatus,
    };
  }
}

export async function ActualizarCalendarObra(id: string, day: Date) {
  try {
    await prisma.coordinates.update({
      where: { id: id },
      data: {
        fechaFinal: day,
      },
    });

    return {
      message: "El calendario de la obra se actualizó correctamente",
      status: 200,
    };
  } catch (error) {
    console.error("Error al actualizar el calendario de la obra:", error);
    return {
      message:
        "No se pudo actualizar el calendario de la obra debido a un error.",
      status: 500,
    };
  }
}
