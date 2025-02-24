import { auth } from "@/auth";
import Page from "./page";

export default async function ServerWrapper() {
  const session = await auth();

  const allowedRoles = ["administrador", "cmunicipales"];

  if (!session?.user?.role || !allowedRoles.includes(session.user.role)) {
    return <h1>Acceso denegado</h1>;
  }

  return <Page />;
}
