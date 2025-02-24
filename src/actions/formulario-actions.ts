"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function deleteObra(id: string) {
  try {
    await prisma.coordinates.delete({
      where: { id },
    });

    return { status: 200, message: "Obra eliminada exitosamente" };
  } catch (error) {
    console.error("Error al eliminar la obra:", error);
    return { status: 500, message: "Error eliminando la obra" };
  }
}

export async function createUsuario(
  id: string,
  cui: string,
  user: string,
  id_propietario: string,
  role: string
) {
  try {
    const hashedNewPassword = await bcrypt.hash(id_propietario, 12);

    // Actualización de coordenadas según el rol
    const coordinateData =
      role === "residente"
        ? { resident: user, propietario_id: id_propietario }
        : role === "supervisor"
        ? { supervisor: user }
        : {};

    await prisma.coordinates.update({
      where: { id },
      data: coordinateData,
    });

    if (role === "residente") {
      // Desactivar todos los registros para el CUI
      await prisma.userPhone.updateMany({
        where: { cui },
        data: { state: "desactivado" },
      });

      // Buscar registros existentes para este propietario y CUI
      const result = await prisma.userPhone.findMany({
        where: { propietario_id: id_propietario, cui },
        select: { propietario_id: true, cui: true },
      });

      if (result.length === 0) {
        await prisma.userPhone.create({
          data: {
            name: user,
            propietario_id: id_propietario,
            user: id_propietario,
            cui,
            state: "activo",
            password: hashedNewPassword,
          },
        });
      } else {
        await prisma.userPhone.updateMany({
          where: { propietario_id: id_propietario, cui },
          data: { state: "activo" },
        });
      }
    } else if (role === "supervisor") {
      // Reiniciar roles previos para este usuario y obra
      await prisma.user.updateMany({
        where: { cuiobra: cui, role },
        data: { role: "" },
      });

      // Buscar registros existentes para este usuario y obra
      const result = await prisma.user.findMany({
        where: { user: id_propietario, cuiobra: cui },
        select: { user: true, cuiobra: true },
      });

      if (result.length === 0) {
        await prisma.user.create({
          data: {
            name: user,
            cuiobra: cui,
            role,
            user: id_propietario,
            password: hashedNewPassword,
          },
        });
      } else {
        await prisma.user.updateMany({
          where: { user: id_propietario, cuiobra: cui },
          data: { role },
        });
      }
    }

    // Creación de la notificación
    await prisma.notification.create({
      data: {
        title: "Registro de nuevo " + role,
        description: "Creación del usuario: " + user,
        status: "actualizado",
        priority: "media",
        cui,
      },
    });

    return { status: 200, message: "Usuario registrado correctamente" };
  } catch (error) {
    console.error("Error en el registro:", error);
    return { status: 500, message: "Error al registrar el usuario" };
  }
}
