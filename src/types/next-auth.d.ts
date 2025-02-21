// types/next-auth.d.ts

import { DefaultSession } from "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      user: string;
      cui?: string; // Agregar `cui`
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: string;
    user: string;
    cui?: string; // Agregar `cui`
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    user: string;
    cui?: string; // Agregar `cui`
  }
}
