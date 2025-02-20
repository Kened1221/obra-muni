"use server";

import { prisma } from "@/lib/prisma";


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
  user: string,
  id_propietario: string,
  typeUser: string
): Promise<{ status: number; message: string }> {
  try {
    if (typeUser === "residente") {
      await prisma.coordinates.update({
        where: { id },
        data: { resident: user, propietario_id: id_propietario },
      });
      return { status: 200, message: "Residente registrado correctamente" };
    }

    if (typeUser === "supervisor") {
      await prisma.coordinates.update({
        where: { id },
        data: { supervisor: user, propietario_id: id_propietario },
      });
      return { status: 200, message: "Supervisor registrado correctamente" };
    }

    return { status: 400, message: "Tipo de usuario inválido" };

  } catch (error) {
    console.error("Error en el registro:", error);
    return { status: 500, message: "Error al registrar el usuario" };
  }
}
