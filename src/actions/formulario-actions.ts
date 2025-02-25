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

    await prisma.coordinates.update({ where: { id }, data: coordinateData });

    if (role === "residente") {
      await handleResidente(cui, id_propietario, user, hashedNewPassword);
    } else if (role === "supervisor") {
      await handleSupervisor(cui, id_propietario, user, hashedNewPassword);
    } else if (role === "cmunicipales") {
      await handleCMunicipales(id_propietario, user, hashedNewPassword);
    }

    // Crear notificación
    await prisma.notification.create({
      data: {
        title: `Registro de nuevo ${role}`,
        description: `Creación del usuario: ${user}`,
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

// Función para manejar el registro de residentes
async function handleResidente(
  cui: string,
  id_propietario: string,
  user: string,
  password: string
) {
  await prisma.userPhone.updateMany({
    where: { cui },
    data: { state: "desactivado" },
  });

  const existe = await prisma.userPhone.count({
    where: { propietario_id: id_propietario, cui },
  });

  if (existe === 0) {
    await prisma.userPhone.create({
      data: {
        name: user,
        propietario_id: id_propietario,
        user: id_propietario,
        cui,
        state: "activo",
        password,
      },
    });
  } else {
    await prisma.userPhone.updateMany({
      where: { propietario_id: id_propietario, cui },
      data: { state: "activo" },
    });
  }
}

// Función para manejar el registro de supervisores
async function handleSupervisor(
  cui: string,
  id_propietario: string,
  user: string,
  password: string
) {
  await prisma.user.updateMany({
    where: { cuiobra: cui, role: "supervisor" },
    data: { role: "" },
  });

  const existe = await prisma.user.count({
    where: { user: id_propietario, cuiobra: cui },
  });

  if (existe === 0) {
    await prisma.user.create({
      data: {
        name: user,
        cuiobra: cui,
        role: "supervisor",
        user: id_propietario,
        password,
      },
    });
  } else {
    await prisma.user.updateMany({
      where: { user: id_propietario, cuiobra: cui },
      data: { role: "supervisor" },
    });
  }
}

// Función para manejar el registro de cmunicipales
async function handleCMunicipales(
  id_propietario: string,
  user: string,
  password: string
) {
  const existe = await prisma.user.count({
    where: { user: id_propietario, role: "cmunicipales" },
  });

  if (existe === 0) {
    await prisma.user.create({
      data: {
        name: user,
        role: "cmunicipales",
        user: id_propietario,
        password,
      },
    });
  }
}
