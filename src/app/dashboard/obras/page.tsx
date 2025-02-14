import { getProyectos } from "@/actions/obras-actions";
import ObrasContainer from "./obras-container";

export const dynamic = "force-dynamic";

async function Page() {
  const proyectos = await getProyectos();

  return (
    <div className="h-full">
      <ObrasContainer obras={proyectos} />
    </div>
  );
}

export default Page;
