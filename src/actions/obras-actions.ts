"use server";

import { prisma } from "@/lib/prisma";

export async function totalObrasRegistradas() {
  try {
    const result = await prisma.coordinates.findMany({
      orderBy: {
        id: "desc",
      },
    });

    if (!result || !Array.isArray(result)) {
      throw new Error("No se encontraron registros en la base de datos.");
    }

    return result.map((obra) => ({
      id: obra.id,
      state: obra.state,
      propietario_id: obra.propietario_id,
      resident: obra.resident,
      projectType: obra.projectType,
      obraType: obra.obraType,
      cui: obra.cui,
      name: obra.name,
      areaOrLength: obra.areaOrLength,
      points: obra.points ? JSON.parse(obra.points) : null,
      fechaFinal: (() => {
        const date = new Date(obra.fechaFinal);
        date.setUTCHours(0, 0, 0, 0);
        return date.toISOString().split("T")[0];
      })(),
    }));
  } catch (error) {
    console.error("Error al buscar obras:", error);
    return [];
  }
}

export async function getObras() {
  try {
    const result = await prisma.coordinates.findMany();

    return result.map((obra) => ({
      id: obra.id,
      state: obra.state,
      propietario_id: obra.propietario_id ?? undefined,
      resident: obra.resident ?? undefined,
      supervisor: obra.supervisor ?? undefined,
      projectType: obra.projectType,
      obraType: obra.obraType,
      cui: obra.cui,
      name: obra.name,
      areaOrLength: obra.areaOrLength,
      points: obra.points ? JSON.parse(obra.points) : null,
      fechaFinal: obra.fechaFinal,
      createdAt: obra.createdAt,
      updatedAt: obra.updatedAt,
    }));
  } catch (error) {
    console.error("Error al buscar obras", error);
    return [];
  }
}

export async function guardarObra(
  projectType: string,
  points: [number, number][],
  areaOrLength: string,
  obraType: string,
  cui: string,
  name: string,
  fechaFinal: Date
) {
  try {
    await prisma.coordinates.create({
      data: {
        state: "Ejecucion",
        projectType,
        obraType,
        cui,
        name,
        areaOrLength,
        points: JSON.stringify(points),
        fechaFinal,
      },
    });

    return {
      message: "La obra y las coordenadas se guardaron con éxito",
      status: 200,
    };
  } catch (error) {
    console.error("Error al guardar la obra:", error);
    return {
      message: "La obra no se pudo guardar",
      status: 500,
    };
  }
}