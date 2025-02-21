import bcrypt from "bcryptjs";
import type { NextAuthConfig, User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { signInSchema } from "./utils/zod/schemas";
import { prisma } from "./lib/prisma";

export default {
  providers: [
    Credentials({
      authorize: async (credentials) => {
        const { data, success } = signInSchema.safeParse(credentials);

        if (!success) {
          throw new Error("Invalid username or password format");
        }

        // Verificar si existe el usuario en la base de datos
        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { user: data.username },
              { email: data.username.toLowerCase() },
            ],
          },
        });

        if (!user || !user.password) {
          throw new Error("Credenciales incorrectas");
        }

        // Verificar si la contraseña es correcta
        const isValid = await bcrypt.compare(data.password, user.password);

        if (!isValid) {
          throw new Error("Credenciales incorrectas");
        }

        // Asegurar que role nunca sea null
        const userRole = user.role ?? "USER"; // Si role es null, asigna "USER"

        // Retornar un objeto que coincide con el tipo User de NextAuth
        return {
          id: user.id,
          name: user.name ?? "",
          email: user.email ?? "",
          cui: user.cui ?? "",
          user: user.user,
          role: userRole,
        } satisfies User;
      },
    }),
  ],
} satisfies NextAuthConfig;
