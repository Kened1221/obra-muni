import Image from "next/image";
import { ModeChange } from "../mode-change";
import Link from "next/link";
import SidebarOptions from "./sidebar-options";
import AvatarUser from "./avatar-user";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

async function Sidebar() {
  const session = await auth();

  return (
    <div className="flex flex-col justify-between items-center px-3 py-4 h-full border-r bg-card">
      <Link href={"/dashboard"} className="py-6">
        <Image
          src="/logos/barra_claro.png"
          alt="logo_claro"
          width={40}
          height={100}
          className="cursor-pointer dark:hidden"
        />
        <Image
          src="/logos/barra_oscuro.png"
          alt="logo_oscuro1"
          width={40}
          height={100}
          className="cursor-pointer hidden dark:block"
        />
      </Link>
      {session && <SidebarOptions session={session} />}

      <div className="space-y-4">
        <ModeChange />
        <AvatarUser />
      </div>
    </div>
  );
}

export default Sidebar;
