import { redirect } from "next/navigation";
import { getUsuarioSesion } from "@/lib/auth";
import NavApp from "@/components/nav-app";

export default async function LayoutApp({ children }: { children: React.ReactNode }) {
  const usuario = await getUsuarioSesion();
  if (!usuario) redirect("/entrar");

  return (
    <div className="snow-bg min-h-screen">
      <NavApp nombre={usuario.nombre} />
      <main className="pt-[88px] pb-20 px-5 max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  );
}
