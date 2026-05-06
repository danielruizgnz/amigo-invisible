import { getIronSession, IronSession } from "iron-session";
import { cookies } from "next/headers";
import { SesionUsuario } from "./types";
import { sessionOptions } from "./session-options";

export { sessionOptions };
export type AppSession = IronSession<{ usuario?: SesionUsuario }>;

export async function getSession(): Promise<AppSession> {
  const cookieStore = await cookies();
  return getIronSession<{ usuario?: SesionUsuario }>(
    cookieStore,
    sessionOptions
  );
}

export async function getUsuarioSesion(): Promise<SesionUsuario | null> {
  const session = await getSession();
  return session.usuario ?? null;
}
