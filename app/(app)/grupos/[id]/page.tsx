export const dynamic = "force-dynamic";

import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getUsuarioSesion } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import FormAnadirParticipante from "./form-anadir-participante";
import FormExclusion from "./form-exclusion";
import BotonSortear from "./boton-sortear";
import BotonEliminarParticipante from "./boton-eliminar-participante";
import BotonEliminarExclusion from "./boton-eliminar-exclusion";

export default async function PaginaGrupo({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const usuario = await getUsuarioSesion();
  if (!usuario) redirect("/entrar");

  const { data: grupo } = await supabaseAdmin
    .from("grupos")
    .select("*")
    .eq("id", id)
    .single();

  if (!grupo) notFound();

  const esOrganizador = grupo.organizador_id === usuario.id;

  if (!esOrganizador) {
    const { data: esPart } = await supabaseAdmin
      .from("participantes")
      .select("id")
      .eq("grupo_id", id)
      .eq("usuario_id", usuario.id)
      .single();
    if (!esPart) notFound();
  }

  // Queries separadas para evitar problemas con joins de claves foráneas múltiples
  const { data: participantesRaw } = await supabaseAdmin
    .from("participantes")
    .select("id, grupo_id, usuario_id, asignado_a_id, token_secreto, creado_en")
    .eq("grupo_id", id)
    .order("creado_en", { ascending: true });

  const { data: exclusionesRaw } = await supabaseAdmin
    .from("exclusiones")
    .select("id, grupo_id, de_usuario_id, a_usuario_id")
    .eq("grupo_id", id);

  // Cargar usuarios referenciados
  const todosUserIds = [
    ...new Set([
      ...(participantesRaw ?? []).map((p) => p.usuario_id),
      ...(exclusionesRaw ?? []).map((e) => e.de_usuario_id),
      ...(exclusionesRaw ?? []).map((e) => e.a_usuario_id),
    ]),
  ].filter(Boolean);

  const { data: usuariosData } = todosUserIds.length
    ? await supabaseAdmin.from("usuarios").select("id, nombre, telefono").in("id", todosUserIds)
    : { data: [] };

  const mapaUsuarios = new Map((usuariosData ?? []).map((u) => [u.id, u]));

  const listaParts = (participantesRaw ?? []).map((p) => ({
    ...p,
    usuario: mapaUsuarios.get(p.usuario_id) ?? null,
  }));

  const listaExclusiones = (exclusionesRaw ?? []).map((e) => ({
    ...e,
    de_usuario: mapaUsuarios.get(e.de_usuario_id) ?? null,
    a_usuario: mapaUsuarios.get(e.a_usuario_id) ?? null,
  }));

  const fechaFormateada = grupo.fecha_evento
    ? new Date(grupo.fecha_evento).toLocaleDateString("es-ES", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  const sorteado = grupo.estado === "sorteado";

  return (
    <div className="space-y-8 pt-6">
      <div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 text-sm text-[#414845] hover:text-[#45655b] transition-colors mb-4"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Volver al dashboard
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1
                className="text-3xl font-medium text-[#191c1d]"
                style={{ fontFamily: "var(--font-epilogue)" }}
              >
                {grupo.nombre}
              </h1>
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  sorteado ? "bg-[#b5d8cc] text-[#002019]" : "bg-[#e6ce99] text-[#251a00]"
                }`}
              >
                {sorteado ? "Sorteado ✓" : "Pendiente"}
              </span>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-[#414845]">
              {fechaFormateada && (
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                  {fechaFormateada}
                </span>
              )}
              {grupo.presupuesto && (
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">payments</span>
                  Máximo {grupo.presupuesto}€
                </span>
              )}
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">group</span>
                {listaParts.length} participantes
              </span>
            </div>
          </div>

          {esOrganizador && !sorteado && (
            <BotonSortear grupoId={id} totalParticipantes={listaParts.length} />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h2
            className="text-xl font-medium text-[#191c1d] flex items-center gap-2"
            style={{ fontFamily: "var(--font-epilogue)" }}
          >
            <span className="material-symbols-outlined text-[#45655b]">group</span>
            Participantes
          </h2>

          <div className="space-y-2">
            {listaParts.map((p) => {
              const esYo = p.usuario_id === usuario.id;
              const esOrg = p.usuario_id === grupo.organizador_id;
              const enlace = `${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/mi-sorteo/${p.token_secreto}`;

              return (
                <div
                  key={p.id}
                  className="glass-card rounded-[16px] px-5 py-4 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#b5d8cc] flex items-center justify-center text-[#45655b] font-bold text-sm flex-shrink-0">
                      {(p.usuario?.nombre ?? "?")
                        .split(" ")
                        .map((s: string) => s[0])
                        .slice(0, 2)
                        .join("")
                        .toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-[#191c1d] text-sm">
                        {p.usuario?.nombre ?? "—"}
                        {esYo && <span className="ml-1 text-xs text-[#45655b]">(tú)</span>}
                        {esOrg && !esYo && <span className="ml-1 text-xs text-[#6e5c31]">(org.)</span>}
                      </p>
                      <p className="text-xs text-[#717975]">{p.usuario?.telefono}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {sorteado && esOrganizador && (
                      <a
                        href={`https://wa.me/?text=${encodeURIComponent(`¡Hola ${p.usuario?.nombre}! Aquí tienes tu enlace del Amigo Invisible: ${enlace}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Compartir por WhatsApp"
                        className="p-1.5 hover:bg-[#b5d8cc]/30 rounded-lg transition-all"
                      >
                        <span className="material-symbols-outlined text-[#45655b] text-[20px]">share</span>
                      </a>
                    )}
                    {esOrganizador && !esYo && !sorteado && (
                      <BotonEliminarParticipante grupoId={id} participanteId={p.id} />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {esOrganizador && !sorteado && (
            <div className="glass-card rounded-[20px] p-6 mt-4">
              <h3
                className="text-base font-medium text-[#191c1d] mb-4 flex items-center gap-2"
                style={{ fontFamily: "var(--font-epilogue)" }}
              >
                <span className="material-symbols-outlined text-[#45655b] text-[18px]">person_add</span>
                Añadir participante
              </h3>
              <FormAnadirParticipante grupoId={id} />
            </div>
          )}

          {sorteado && (
            <div className="glass-card rounded-[20px] p-6 mt-4 bg-[#c7eade]/30">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-[#45655b] icon-filled text-[24px] flex-shrink-0 mt-0.5">
                  check_circle
                </span>
                <div>
                  <p className="font-semibold text-[#191c1d] text-sm">¡El sorteo ha sido lanzado!</p>
                  <p className="text-[#414845] text-xs mt-1">
                    Comparte los enlaces individuales con cada participante (botón WhatsApp al lado de cada nombre).
                  </p>
                  {listaParts.find((p) => p.usuario_id === usuario.id) && (
                    <Link
                      href={`/mi-sorteo/${listaParts.find((p) => p.usuario_id === usuario.id)?.token_secreto}`}
                      className="inline-flex items-center gap-1 mt-3 text-sm font-semibold text-[#45655b] hover:underline"
                    >
                      <span className="material-symbols-outlined text-[16px]">visibility</span>
                      Ver mi asignación
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {esOrganizador && (
          <div className="space-y-4">
            <h2
              className="text-xl font-medium text-[#191c1d] flex items-center gap-2"
              style={{ fontFamily: "var(--font-epilogue)" }}
            >
              <span className="material-symbols-outlined text-[#6e5c31]">block</span>
              Exclusiones
            </h2>
            <p className="text-xs text-[#414845]">
              Define quién <strong>no puede</strong> regalar a quién (ej: parejas).
            </p>

            {!sorteado && listaParts.length >= 2 && (
              <div className="glass-card rounded-[20px] p-5">
                <FormExclusion grupoId={id} participantes={listaParts as any} />
              </div>
            )}

            {listaExclusiones.length > 0 ? (
              <div className="space-y-2">
                {listaExclusiones.map((ex) => (
                  <div
                    key={ex.id}
                    className="glass-card rounded-[14px] px-4 py-3 flex items-center justify-between gap-2"
                  >
                    <p className="text-sm text-[#191c1d]">
                      <strong>{ex.de_usuario?.nombre}</strong>
                      <span className="text-[#717975] mx-1">→ no a</span>
                      <strong>{ex.a_usuario?.nombre}</strong>
                    </p>
                    {!sorteado && (
                      <BotonEliminarExclusion grupoId={id} exclusionId={ex.id} />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#717975] italic">Sin exclusiones configuradas.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
