/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { prisma } from "@/lib/prisma";
// import bcrypt from "bcryptjs";

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

// const hashedNewPassword = await bcrypt.hash(propietario_id, 12);
// await prisma.userPhone.create({
//   data: {
//     name: resident,
//     propietario_id: propietario_id,
//     user: propietario_id,
//     state: "Activo",
//     cui: cui,
//     password: hashedNewPassword,
//   },
// });

// await prisma.notification.create({
//   data: {
//     UserID: propietario_id,
//     title:
//       "Registro de nueva " +
//       (projectType === "Superficie" ? "construcción" : "carretera"),
//     description: name,
//     status: "actualizado",
//     priority: "media",
//   },
// });
