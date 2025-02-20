import ObrasContainer from "./registro-container";

export const dynamic = "force-dynamic";

async function Page() {
  return (
    <div className="h-full">
      <ObrasContainer />
    </div>
  );
}

export default Page;
