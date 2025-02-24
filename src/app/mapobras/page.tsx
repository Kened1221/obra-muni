/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import SideDashboard from "@/components/views/side-dashboard";
import { totalObrasRegistradas } from "@/actions/obras-actions";
import CustomMap from "@/components/maps/custom-map";
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
        <SheetTrigger className="absolute top-5 right-5 z-10 flex items-center justify-center gap-2 bg-[#FFEDD5] text-[#22252A] border-2 border-[#FBB889] rounded-xl px-4 py-2 transition duration-300 ease-in-out hover:bg-[#EFC5A9] hover:scale-105 hover:shadow-lg"
        >
          <FaMapMarked />
          REGISTRO OBRAS
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle></SheetTitle>
            <SheetDescription asChild>
              <div>
                <SideDashboard
                  totalObras={queryResult}
                  setDefaultLocation={setDefaultLocation}
                />
              </div>
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>

      <div className="rounded-xl overflow-hidden h-full w-full">
        <CustomMap obrasT={queryResult} defaultLocation={defaultLocation} />
      </div>
    </div>
  );
}

export default Obras;
