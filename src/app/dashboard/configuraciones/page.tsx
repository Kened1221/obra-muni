import { auth } from "@/auth";
import CuentaContainer from "./cuenta-container";

export const dynamic = "force-dynamic";

async function Page() {
  const session = await auth();

  if (!session) {
    return <p>No se pudo obtener la sesión. Por favor, inicia sesión.</p>;
  }
  const formattedSession = {
    ...session,
    user: {
      ...session.user,
      name: session.user.name || "",
      email: session.user.email || "",
      user: session.user.user || "usuario",
      cui: session.user.cui || "",
    },
  };

  return (
    <div className="w-full h-full flex items-center justify-center">
      <CuentaContainer session={formattedSession} />
    </div>
  );
}

export default Page;
