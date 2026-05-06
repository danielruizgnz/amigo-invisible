"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { accionCerrarSesion } from "@/app/(auth)/entrar/actions";

interface Props {
  nombre: string;
}

export default function NavApp({ nombre }: Props) {
  const pathname = usePathname();

  const links = [
    { href: "/dashboard", label: "Mis sorteos", icon: "dashboard" },
    { href: "/grupos/nuevo", label: "Nuevo sorteo", icon: "add_circle" },
  ];

  const iniciales = nombre
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="fixed top-0 w-full z-50 bg-white/60 backdrop-blur-xl border-b border-white/20 shadow-[0_8px_32px_0_rgba(115,87,93,0.1)]">
      <div className="flex justify-between items-center px-5 py-5 max-w-7xl mx-auto">
        <Link
          href="/dashboard"
          className="text-xl font-semibold text-[#45655b] hover:opacity-80 transition-opacity"
          style={{ fontFamily: "var(--font-epilogue)" }}
        >
          Amigo Invisible
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((link) => {
            const activo = pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 text-sm font-semibold transition-colors ${
                  activo
                    ? "text-[#45655b] border-b-2 border-[#45655b] pb-0.5"
                    : "text-[#414845] hover:text-[#45655b]"
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">{link.icon}</span>
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          {/* Avatar con iniciales */}
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-[#b5d8cc] flex items-center justify-center text-[#45655b] font-bold text-sm">
              {iniciales}
            </div>
            <span className="hidden md:block text-sm font-medium text-[#191c1d]">{nombre}</span>
          </div>

          {/* Cerrar sesión */}
          <form action={accionCerrarSesion}>
            <button
              type="submit"
              title="Cerrar sesión"
              className="p-2 hover:bg-[#b5d8cc]/30 rounded-lg transition-all"
            >
              <span className="material-symbols-outlined text-[#414845] text-[20px]">logout</span>
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
