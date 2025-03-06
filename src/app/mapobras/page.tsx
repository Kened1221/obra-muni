/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { totalObrasRegistradas } from "@/actions/obras-actions";
import dynamic from "next/dynamic";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { useEffect, useState } from "react";
import { FaMapMarked } from "react-icons/fa";

const DynamicSideDashboard = dynamic(
  () => import("@/components/views/side-dashboard"),
  { ssr: false }
);
const DynamicCustomMap = dynamic(() => import("@/components/maps/map-principal"), {
  ssr: false,
});

interface UserLocation {
  latitude: number;
  longitude: number;
}

function Obras() {
  const [queryResult, setQueryResult] = useState<any[]>([]);
  const [defaultLocation, setDefaultLocation] = useState<UserLocation>({
    latitude: -12.619648,
    longitude: -73.789429,
  });

  useEffect(() => {
    const getObrasData = async () => {
      const obras = await totalObrasRegistradas();
      setQueryResult(obras);
    };
    getObrasData();
  }, []);

  return (
    <div className="w-full h-full p-2">
      <Sheet>
        <SheetTrigger className="absolute top-5 right-5 z-10 flex items-center justify-center gap-2 bg-[#FFEDD5] text-[#22252A] border-2 border-[#FBB889] rounded-xl px-4 py-2 transition duration-300 ease-in-out hover:bg-[#EFC5A9] hover:scale-105 hover:shadow-lg">
          <FaMapMarked />
          REGISTRO OBRAS
        </SheetTrigger>
        <SheetContent className="rounded-l-lg bg-gradient-to-b from-[#ececec] dark:from-[#2D2D2D] dark:to-[#2D2D2D] to-[#eba77a]">
          <SheetHeader>
            <SheetTitle></SheetTitle>
            <SheetDescription asChild>
              <DynamicSideDashboard
                totalObras={queryResult}
                setDefaultLocation={setDefaultLocation}
              />
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>

      <div className="rounded-xl overflow-hidden h-full w-full">
        <DynamicCustomMap
          obrasT={queryResult}
          defaultLocation={defaultLocation}
        />
      </div>
    </div>
  );
}

export default Obras;
