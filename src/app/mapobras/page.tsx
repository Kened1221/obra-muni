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

  console.log(queryResult);

  return (
    <div className="w-full h-full p-2">
      <Sheet>
        <SheetTrigger className="absolute flex flex-row top-5 right-5 z-10 bg-[#FFEDD5] text-[#22252A] border-[#FBB889] border-2 rounded-xl p-4 gap-2 hover:bg-[#EFC5A9] items-center justify-center">
          <FaMapMarked />
          ABRIR OBRAS
        </SheetTrigger>
        <SheetContent >
          <SheetHeader>
            <SheetTitle></SheetTitle>
            <SheetDescription>
              <SideDashboard
                totalObras={queryResult}
                setDefaultLocation={setDefaultLocation}
              />
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>

      {/* <div className="overflow-y-auto p-4 h-full w-fit rounded-xl bg-gradient-to-b from-[#ececec] dark:from-[#2D2D2D] dark:to-[#2D2D2D] to-[#eba77a]">
        <SideDashboard
          totalObras={queryResult}
          setDefaultLocation={setDefaultLocation}
        />
      </div> */}

      <div className="rounded-xl overflow-hidden h-full w-full">
        <CustomMap obrasT={queryResult} defaultLocation={defaultLocation} />
      </div>
    </div>
  );
}

export default Obras;
