import NextAuth from "next-auth";

import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import authConfig from "./auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  ...authConfig,
  session: {
    strategy: "jwt",
    maxAge: 30 * 60, // Tiempo de expiracón 30 minutos
    updateAge: 10 * 60, // Actualiza el tiempo de expiración cada 10 minutos
  },
  trustHost: true,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Verificar que user.id no sea undefined
        if (user.id) {
          token.id = user.id; // Asignar solo si user.id es un string
        }
        token.role = user.role;
        token.user = user.user;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id; // Incluye el ID en la sesión
      session.user.role = token.role; // Incluye el rol en la sesión
      session.user.user = token.user; //
      return session;
    },
    authorized: async ({ auth }) => {
      return !!auth;
    },
  },
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: "/login",
  },
});
