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
): Promise<{ status: number; message: string }> {
  try {
    if (role === "residente") {
      await prisma.coordinates.update({
        where: { id },
        data: { resident: user, propietario_id: id_propietario },
      });
    }

    if (role === "supervisor") {
      await prisma.coordinates.update({
        where: { id },
        data: { supervisor: user, propietario_id: id_propietario },
      });
    }

    const hashedNewPassword = await bcrypt.hash(id_propietario, 12);

    await prisma.user.create({
      data: {
        name: user,
        role,
        cui,
        user: id_propietario,
        password: hashedNewPassword,
      },
    });

    await prisma.notification.create({
      data: {
        title: "Registro de nuevo " + role,
        description: "Creación del usuario: " + user,
        status: "actualizado",
        priority: "media",
        cui,
      },
    });

    return { status: 200, message: "Residente registrado correctamente" };
  } catch (error) {
    console.error("Error en el registro:", error);
    return { status: 500, message: "Error al registrar el usuario" };
  }
}
