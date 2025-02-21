import { getNotification, getNotificationUser } from "@/actions/notificactions-actions";
import Notifications from "./notifications-container";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

async function Page() {
  const session = await auth();
  const allowedRoles = ["administrador", "cmunicipales"];

  let notification = [];

  if (session?.user?.role && allowedRoles.includes(session.user.role)) {
    notification = await getNotification();
  } else {
    notification = await getNotificationUser(session?.user?.cui ?? "");
  }

  return (
    <main className="w-full flex items-center justify-center flex-col gap-4">
      <h1 className="text-2xl font-bold text-center py-4">Notificaciones</h1>
      {notification.length > 0 ? (
        <section className="w-full mx-auto space-y-4">
          <Notifications notifications={notification} />
        </section>
      ) : (
        <p className="text-lg text-gray-600 dark:text-gray-400 text-center">
          No tienes notificaciones en este momento...
        </p>
      )}
    </main>
  );
}

export default Page;
