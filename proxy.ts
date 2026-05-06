import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions } from "@/lib/session-options";
import { SesionUsuario } from "@/lib/types";

const RUTAS_PROTEGIDAS = ["/dashboard", "/grupos"];
const RUTAS_AUTH = ["/entrar"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const esRutaProtegida = RUTAS_PROTEGIDAS.some((r) =>
    pathname.startsWith(r)
  );
  const esRutaAuth = RUTAS_AUTH.some((r) => pathname.startsWith(r));

  const session = await getIronSession<{ usuario?: SesionUsuario }>(
    request,
    NextResponse.next(),
    sessionOptions
  );

  const estaAutenticado = !!session.usuario;

  if (esRutaProtegida && !estaAutenticado) {
    return NextResponse.redirect(new URL("/entrar", request.url));
  }

  if (esRutaAuth && estaAutenticado) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/grupos/:path*", "/entrar"],
};
