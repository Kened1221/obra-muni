import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/auth";

export async function middleware(req: NextRequest) {
  // Permitir acceso sin autenticación a /dashboard/detalles
  if (req.nextUrl.pathname.startsWith('/dashboard/detalles')) {
    return NextResponse.next();
  }

  const session = await auth();

  // Si no hay sesión, redirigir a la página de login con callbackUrl
  if (!session) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('callbackUrl', req.nextUrl.pathname); // Mantener la URL original
    return NextResponse.redirect(loginUrl);
  }

  // Verificar si la sesión ha expirado y redirigir si es necesario
  if (new Date(session.expires) < new Date()) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('callbackUrl', req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
