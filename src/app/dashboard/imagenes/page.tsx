"use client";

import { useEffect, useState } from "react";
import RegistrosContainer from "./registros-container";
import { getCooImg } from "@/actions/register-action";
import UploadImages from "./UploadImages";

interface Record {
  propietario_id: string | null;
  resident: string | null;
  cui: string;
  name: string;
  count: number;
}

export const dynamic = "force-dynamic";

function Page() {
  const [record, setRecord] = useState<Record[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCooImg();
        setRecord(data);
      } catch (error) {
        console.error("Error al obtener registros:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <main className="grid w-full items-center justify-center gap-4">
      <div>
        <UploadImages record={record} />
      </div>
      <div>
        {loading ? (
          <p className="text-lg text-gray-600 dark:text-gray-400 text-center">
            Cargando registros...
          </p>
        ) : record.length === 0 ? (
          <p className="text-lg text-gray-600 dark:text-gray-400 text-center">
            No tienes registros en este momento...
          </p>
        ) : (
          <section className="w-full mx-auto">
            <RegistrosContainer registros={record} />
          </section>
        )}
      </div>
    </main>
  );
}

export default Page;
