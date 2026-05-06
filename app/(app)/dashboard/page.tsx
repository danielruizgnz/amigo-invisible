export const dynamic = "force-dynamic";

import Link from "next/link";
import { getUsuarioSesion } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { Grupo } from "@/lib/types";
import { redirect } from "next/navigation";

export default async function PaginaDashboard() {
  const usuario = await getUsuarioSesion();
  if (!usuario) redirect("/entrar");

  // Grupos donde es organizador
  const { data: gruposOrganizador } = await supabaseAdmin
    .from("grupos")
    .select("*")
    .eq("organizador_id", usuario.id)
    .order("creado_en", { ascending: false });

  // Grupos donde es participante (pero no organizador)
  const { data: participaciones } = await supabaseAdmin
    .from("participantes")
    .select("*, grupo:grupos(*)")
    .eq("usuario_id", usuario.id)
    .neq("grupo.organizador_id", usuario.id);

  const gruposParticipante = participaciones
    ?.map((p) => p.grupo as Grupo)
    .filter(Boolean) ?? [];

  const misGrupos: Grupo[] = gruposOrganizador ?? [];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-6">
        <div>
          <h1
            className="text-3xl font-medium text-[#191c1d]"
            style={{ fontFamily: "var(--font-epilogue)" }}
          >
            Hola, {usuario.nombre.split(" ")[0]} 👋
          </h1>
          <p className="text-[#414845] mt-1">
            Gestiona tus sorteos de Amigo Invisible desde aquí.
          </p>
        </div>
        <Link
          href="/grupos/nuevo"
          className="inline-flex items-center gap-2 bg-[#45655b] text-white font-semibold text-sm px-6 py-3 rounded-xl hover:bg-[#45655b]/90 active:scale-[0.98] transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Nuevo sorteo
        </Link>
      </div>

      {/* Sorteos que organizo */}
      <section>
        <h2
          className="text-xl font-medium text-[#191c1d] mb-4 flex items-center gap-2"
          style={{ fontFamily: "var(--font-epilogue)" }}
        >
          <span className="material-symbols-outlined text-[#45655b]">star</span>
          Sorteos que organizo
        </h2>

        {misGrupos.length === 0 ? (
          <div className="glass-card rounded-[24px] p-10 text-center">
            <span
              className="material-symbols-outlined text-[#b5d8cc] icon-filled mb-4"
              style={{ fontSize: 64 }}
            >
              card_giftcard
            </span>
            <p className="text-[#414845] mb-4">Todavía no has creado ningún sorteo.</p>
            <Link
              href="/grupos/nuevo"
              className="inline-flex items-center gap-2 bg-[#45655b] text-white font-semibold text-sm px-6 py-3 rounded-xl hover:bg-[#45655b]/90 transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              Crear mi primer sorteo
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {misGrupos.map((grupo) => (
              <TarjetaGrupo key={grupo.id} grupo={grupo} esOrganizador />
            ))}
          </div>
        )}
      </section>

      {/* Sorteos donde participo */}
      {gruposParticipante.length > 0 && (
        <section>
          <h2
            className="text-xl font-medium text-[#191c1d] mb-4 flex items-center gap-2"
            style={{ fontFamily: "var(--font-epilogue)" }}
          >
            <span className="material-symbols-outlined text-[#73575d]">group</span>
            Sorteos donde participo
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {gruposParticipante.map((grupo) => (
              <TarjetaGrupo key={grupo.id} grupo={grupo} esOrganizador={false} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function TarjetaGrupo({ grupo, esOrganizador }: { grupo: Grupo; esOrganizador: boolean }) {
  const estadoColor = grupo.estado === "sorteado"
    ? "bg-[#b5d8cc] text-[#002019]"
    : "bg-[#e6ce99] text-[#251a00]";

  const estadoLabel = grupo.estado === "sorteado" ? "Sorteado" : "Pendiente";

  const fechaFormateada = grupo.fecha_evento
    ? new Date(grupo.fecha_evento).toLocaleDateString("es-ES", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <Link
      href={`/grupos/${grupo.id}`}
      className="glass-card rounded-[24px] p-6 flex flex-col gap-4 hover:shadow-[0_8px_32px_0_rgba(69,101,91,0.15)] transition-all active:scale-[0.99] group"
    >
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-xl bg-[#c7eade] flex items-center justify-center">
          <span className="material-symbols-outlined text-[#45655b] icon-filled text-[20px]">
            card_giftcard
          </span>
        </div>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${estadoColor}`}>
          {estadoLabel}
        </span>
      </div>

      <div>
        <h3
          className="text-lg font-medium text-[#191c1d] group-hover:text-[#45655b] transition-colors"
          style={{ fontFamily: "var(--font-epilogue)" }}
        >
          {grupo.nombre}
        </h3>
        {fechaFormateada && (
          <p className="text-sm text-[#414845] mt-1 flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">calendar_today</span>
            {fechaFormateada}
          </p>
        )}
        {grupo.presupuesto && (
          <p className="text-sm text-[#414845] flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">payments</span>
            {grupo.presupuesto}€ por regalo
          </p>
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-[#717975] pt-1 border-t border-[#c1c8c4]/30">
        <span>{esOrganizador ? "Organizador" : "Participante"}</span>
        <span className="material-symbols-outlined text-[#45655b] text-[16px] group-hover:translate-x-0.5 transition-transform">
          arrow_forward
        </span>
      </div>
    </Link>
  );
}
