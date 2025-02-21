"use client";

import Link from "next/link";
import { GoHomeFill } from "react-icons/go";
import { IoSettings, IoNotifications } from "react-icons/io5";
import { FaListAlt, FaBook } from "react-icons/fa";
import { BsDatabaseFillCheck } from "react-icons/bs";
import { usePathname } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Session = {
  user: {
    name?: string | null;
    email?: string | null;
    id: string;
    role: string;
    user: string;
  };
  expires: string;
};

type CuentaContainerProps = {
  session?: Session | null;
};

function SidebarOptions({ session }: CuentaContainerProps) {
  const pathname = usePathname();

  // 🔹 Definir enlaces para cada rol
  const adminLinks = [
    {
      href: "/dashboard/registros",
      icon: <BsDatabaseFillCheck className="text-xl" />,
      tooltip: "Registros",
    },
    {
      href: "/dashboard",
      icon: <GoHomeFill className="text-xl" />,
      tooltip: "Inicio",
    },
    {
      href: "/dashboard/imagenes",
      icon: <FaBook className="text-xl" />,
      tooltip: "Imagenes",
    },
    {
      href: "/dashboard/listas",
      icon: <FaListAlt className="text-xl" />,
      tooltip: "Listas",
    },
    {
      href: "/dashboard/notificaciones",
      icon: <IoNotifications className="text-xl" />,
      tooltip: "Notificaciones",
    },
    {
      href: "/dashboard/configuraciones",
      icon: <IoSettings className="text-xl" />,
      tooltip: "Configuraciones",
    },
  ];

  const cmunicipalesLinks = [
    {
      href: "/dashboard/registros",
      icon: <BsDatabaseFillCheck className="text-xl" />,
      tooltip: "Registros",
    },
    {
      href: "/dashboard",
      icon: <GoHomeFill className="text-xl" />,
      tooltip: "Inicio",
    },
    {
      href: "/dashboard/imagenes",
      icon: <FaBook className="text-xl" />,
      tooltip: "Imagenes",
    },
    {
      href: "/dashboard/listas",
      icon: <FaListAlt className="text-xl" />,
      tooltip: "Listas",
    },
    {
      href: "/dashboard/notificaciones",
      icon: <IoNotifications className="text-xl" />,
      tooltip: "Notificaciones",
    },
    {
      href: "/dashboard/configuraciones",
      icon: <IoSettings className="text-xl" />,
      tooltip: "Configuraciones",
    },
  ];

  const residenteLinks = [
    {
      href: "/dashboard/registros",
      icon: <BsDatabaseFillCheck className="text-xl" />,
      tooltip: "Registros",
    },
    {
      href: "/dashboard",
      icon: <GoHomeFill className="text-xl" />,
      tooltip: "Inicio",
    },
    {
      href: "/dashboard/imagenes",
      icon: <FaBook className="text-xl" />,
      tooltip: "Imagenes",
    },
    {
      href: "/dashboard/listas",
      icon: <FaListAlt className="text-xl" />,
      tooltip: "Listas",
    },
    {
      href: "/dashboard/notificaciones",
      icon: <IoNotifications className="text-xl" />,
      tooltip: "Notificaciones",
    },
    {
      href: "/dashboard/configuraciones",
      icon: <IoSettings className="text-xl" />,
      tooltip: "Configuraciones",
    },
  ];

  const supervisorLinks = [
    {
      href: "/dashboard/registros",
      icon: <FaBook className="text-xl" />,
      tooltip: "Registros",
    },
    {
      href: "/dashboard/formularios",
      icon: <FaListAlt className="text-xl" />,
      tooltip: "Formularios",
    },
  ];

  // 🔹 Determinar qué enlaces usar según el rol
  const links = (() => {
    switch (session?.user.role) {
      case "administrador":
        return adminLinks;
      case "residente":
        return residenteLinks;
      case "supervisor":
        return supervisorLinks;
      case "cmunicipales":
        return cmunicipalesLinks;
      default:
        return [];
    }
  })();

  return (
    <div className="flex flex-col gap-6 items-center">
      <TooltipProvider>
        {links.map(({ href, icon, tooltip }) => (
          <Tooltip key={href}>
            <Link
              href={href}
              className={`relative p-2 rounded-full ${
                pathname === href
                  ? "bg-[#CDCDCD] dark:bg-[#40404B] text-[#030303] dark:text-white"
                  : "text-[#030303] dark:text-[#8E8EA8]"
              } hover:text-[#8E8EA8] dark:hover:text-white`}
            >
              <TooltipTrigger className="absolute top-0 left-0 w-full h-full" />
              {icon}
            </Link>
            <TooltipContent className="absolute left-5 bg-primary">
              <p>{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
    </div>
  );
}

export default SidebarOptions;
