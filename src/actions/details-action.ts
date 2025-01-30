/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function obtenerDetalles(id: string) {
  try {
    const result = await prisma.coordinates.findMany();

    const obraEncontrada = result.find((obra: any) => obra.id === id);

    if (!obraEncontrada) {
      return null;
    }

    const tiempoTotal = obraEncontrada.fechaFinal.getTime() - obraEncontrada.createdAt.getTime();

    const tiempoTranscurrido =new Date().getTime() - obraEncontrada.createdAt.getTime();
    
    let porcentaje = Number(
      ((tiempoTranscurrido / tiempoTotal) * 100).toFixed(3)
    );
    
    if (porcentaje >= 100) {
      porcentaje = 100;
    }

    const formattedObra = {
      id: obraEncontrada.id,
      state: obraEncontrada.state,
      cui: obraEncontrada.cui,
      name: obraEncontrada.name,
      points: JSON.parse(obraEncontrada.points),
      areaOrLength: obraEncontrada.areaOrLength,
      resident: obraEncontrada.resident,
      projectType: obraEncontrada.projectType,
      propietario_id: obraEncontrada.propietario_id,
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

export async function FinalizarObra(id: string, cui: string) {
  try {
    await prisma.coordinates.update({
      where: { id: id },
      data: {
        state: "Finalizado",
      },
    });

    await prisma.userPhone.updateMany({
      where: { cui: cui },
      data: {
        state: "Inactivo",
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

export async function ActualizarResidenteO(
  id: string,
  cui: string,
  id_propietario: string,
  user: string
) {
  try {
    const busqueda = await prisma.coordinates.findMany();

    const obraEncontrada = busqueda.find((user: any) => user.cui === cui);

    if (!obraEncontrada) {
      return {
        message: "No se encontró la obra correspondiente.",
        status: 404,
      };
    }

    const result = await prisma.userPhone.findMany();

    const userEncontrado = result.find(
      (user: any) => user.propietario_id === id_propietario
    );

    if (!userEncontrado) {
      const hashedNewPassword = await bcrypt.hash(id_propietario, 12);

      await prisma.userPhone.create({
        data: {
          name: user,
          propietario_id: id_propietario,
          user: id_propietario,
          state: "Activo",
          cui: cui,
          password: hashedNewPassword,
        },
      });
    } else {
      await prisma.userPhone.updateMany({
        where: { propietario_id: id_propietario },
        data: {
          state: "Activo",
        },
      });
    }

    await prisma.project.updateMany({
      where: { cui: cui },
      data: {
        propietarioId: id_propietario,
        resident: user,
      },
    });

    // Actualiza el estado del residente
    await prisma.userPhone.updateMany({
      where: { propietario_id: obraEncontrada?.propietario_id },
      data: {
        state: "Inactivo",
      },
    });

    // Actualiza los datos del propietario y residente en las coordenadas
    await prisma.coordinates.update({
      where: { id: id },
      data: {
        propietario_id: id_propietario,
        resident: user,
      },
    });

    // Crea una notificación
    await prisma.notification.create({
      data: {
        UserID: id_propietario,
        title: "Nuevo residente",
        description: obraEncontrada?.name,
        status: "actualizado",
        priority: "media",
      },
    });

    return {
      message: "El residente se guardó con éxito",
      status: 200,
    };
  } catch (error: unknown) {
    const errorStatus = error instanceof Error ? 500 : 400;
    console.error("Error al actualizar el residente:", error);
    return {
      message: "No se pudo actualizar el residente",
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
