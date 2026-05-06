export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase";
import FormWishlist from "./form-wishlist";

export default async function PaginaMiSorteo({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  const { data: participante } = await supabaseAdmin
    .from("participantes")
    .select("id, usuario_id, asignado_a_id, token_secreto, grupo_id")
    .eq("token_secreto", token)
    .single();

  if (!participante) notFound();

  // Cargar grupo, yo y mi asignado por separado
  const [{ data: grupo }, { data: yo }, { data: miAsignado }] = await Promise.all([
    supabaseAdmin.from("grupos").select("*").eq("id", participante.grupo_id).single(),
    supabaseAdmin.from("usuarios").select("id, nombre, telefono").eq("id", participante.usuario_id).single(),
    participante.asignado_a_id
      ? supabaseAdmin.from("usuarios").select("id, nombre").eq("id", participante.asignado_a_id).single()
      : Promise.resolve({ data: null }),
  ]);

  if (!grupo || !yo) notFound();

  const sorteado = grupo.estado === "sorteado";

  const { data: miWishlist } = await supabaseAdmin
    .from("items_deseos")
    .select("*")
    .eq("usuario_id", yo.id)
    .eq("grupo_id", grupo.id)
    .order("creado_en", { ascending: true });

  let wishlistAsignado: any[] = [];
  if (miAsignado?.id) {
    const { data } = await supabaseAdmin
      .from("items_deseos")
      .select("*")
      .eq("usuario_id", miAsignado.id)
      .eq("grupo_id", grupo.id)
      .order("creado_en", { ascending: true });
    wishlistAsignado = data ?? [];
  }

  const fechaFormateada = grupo.fecha_evento
    ? new Date(grupo.fecha_evento).toLocaleDateString("es-ES", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="snow-bg min-h-screen">
      {/* Nav */}
      <header className="bg-white/60 backdrop-blur-xl border-b border-white/20 shadow-[0_8px_32px_0_rgba(115,87,93,0.1)]">
        <div className="flex items-center justify-between px-5 py-5 max-w-3xl mx-auto">
          <Link
            href="/"
            className="text-xl font-semibold text-[#45655b] hover:opacity-80 transition-opacity"
            style={{ fontFamily: "var(--font-epilogue)" }}
          >
            Amigo Invisible
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-sm text-[#414845] hidden sm:block">
              Hola, <strong>{yo.nombre.split(" ")[0]}</strong> 👋
            </span>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#45655b] bg-[#b5d8cc]/30 hover:bg-[#b5d8cc]/50 px-4 py-2 rounded-full transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">dashboard</span>
              Mis sorteos
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-5 py-10 space-y-8">
        {/* Info del sorteo */}
        <div className="glass-card rounded-[24px] p-6">
          <h1
            className="text-2xl font-medium text-[#191c1d] mb-2"
            style={{ fontFamily: "var(--font-epilogue)" }}
          >
            {grupo.nombre}
          </h1>
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
          </div>
        </div>

        {/* Mi asignado */}
        {sorteado && miAsignado ? (
          <div className="glass-card rounded-[24px] p-8 bg-gradient-to-br from-[#c7eade]/40 to-[#f9e0aa]/30 text-center">
            <span
              className="material-symbols-outlined text-[#6e5c31] icon-filled mb-4"
              style={{ fontSize: 56 }}
            >
              card_giftcard
            </span>
            <p className="text-sm font-semibold text-[#6e5c31] uppercase tracking-widest mb-2">
              Tu amigo invisible es
            </p>
            <h2
              className="text-4xl font-semibold text-[#191c1d] mb-4"
              style={{ fontFamily: "var(--font-epilogue)" }}
            >
              {miAsignado.nombre}
            </h2>
            {grupo.presupuesto && (
              <p className="text-sm text-[#414845]">
                Recuerda: el presupuesto máximo es <strong>{grupo.presupuesto}€</strong>
              </p>
            )}

            {wishlistAsignado.length > 0 && (
              <div className="mt-6 text-left">
                <h3
                  className="text-base font-medium text-[#191c1d] mb-3 flex items-center gap-2"
                  style={{ fontFamily: "var(--font-epilogue)" }}
                >
                  <span className="material-symbols-outlined text-[#45655b] text-[18px]">format_list_bulleted</span>
                  Lista de deseos de {miAsignado.nombre.split(" ")[0]}
                </h3>
                <div className="space-y-2">
                  {wishlistAsignado.map((item: any) => (
                    <div key={item.id} className="bg-white/50 rounded-xl px-4 py-3 flex items-start gap-3">
                      <span className="material-symbols-outlined text-[#6e5c31] icon-filled text-[18px] flex-shrink-0 mt-0.5">
                        redeem
                      </span>
                      <div>
                        <p className="font-medium text-[#191c1d] text-sm">{item.titulo}</p>
                        {item.url && (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-[#45655b] hover:underline flex items-center gap-0.5 mt-0.5"
                          >
                            <span className="material-symbols-outlined text-[12px]">open_in_new</span>
                            Ver enlace
                          </a>
                        )}
                        {item.notas && <p className="text-xs text-[#717975] mt-0.5">{item.notas}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {wishlistAsignado.length === 0 && (
              <p className="mt-4 text-sm text-[#717975] italic">
                {miAsignado.nombre.split(" ")[0]} aún no ha añadido su lista de deseos.
              </p>
            )}
          </div>
        ) : !sorteado ? (
          <div className="glass-card rounded-[24px] p-8 text-center">
            <span className="material-symbols-outlined text-[#b5d8cc] mb-4" style={{ fontSize: 56 }}>
              lock
            </span>
            <h2
              className="text-xl font-medium text-[#191c1d] mb-2"
              style={{ fontFamily: "var(--font-epilogue)" }}
            >
              El sorteo aún no ha sido lanzado
            </h2>
            <p className="text-sm text-[#414845]">
              El organizador todavía no ha lanzado el sorteo. Vuelve más tarde.
            </p>
          </div>
        ) : null}

        {/* Mi lista de deseos */}
        <div className="glass-card rounded-[24px] p-6 space-y-4">
          <div>
            <h2
              className="text-xl font-medium text-[#191c1d] flex items-center gap-2"
              style={{ fontFamily: "var(--font-epilogue)" }}
            >
              <span className="material-symbols-outlined text-[#73575d]">format_list_bulleted</span>
              Mi lista de deseos
            </h2>
            <p className="text-sm text-[#414845] mt-1">
              Opcional. Tu amigo invisible podrá verla para inspirarse.
            </p>
          </div>

          {(miWishlist ?? []).length > 0 && (
            <div className="space-y-2">
              {(miWishlist ?? []).map((item: any) => (
                <ItemDeseo key={item.id} item={item} usuarioId={yo.id} grupoId={grupo.id} token={token} />
              ))}
            </div>
          )}

          <FormWishlist usuarioId={yo.id} grupoId={grupo.id} token={token} />
        </div>
      </main>
    </div>
  );
}

function ItemDeseo({
  item,
  usuarioId,
  grupoId,
  token,
}: {
  item: any;
  usuarioId: string;
  grupoId: string;
  token: string;
}) {
  async function eliminar() {
    "use server";
    const { revalidatePath } = await import("next/cache");
    await supabaseAdmin
      .from("items_deseos")
      .delete()
      .eq("id", item.id)
      .eq("usuario_id", usuarioId);
    revalidatePath(`/mi-sorteo/${token}`);
  }

  return (
    <div className="flex items-start gap-3 bg-white/40 rounded-xl px-4 py-3">
      <span className="material-symbols-outlined text-[#73575d] icon-filled text-[18px] flex-shrink-0 mt-0.5">
        redeem
      </span>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-[#191c1d] text-sm">{item.titulo}</p>
        {item.url && (
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[#45655b] hover:underline flex items-center gap-0.5 mt-0.5"
          >
            <span className="material-symbols-outlined text-[12px]">open_in_new</span>
            {item.url.length > 40 ? item.url.slice(0, 40) + "..." : item.url}
          </a>
        )}
        {item.notas && <p className="text-xs text-[#717975] mt-0.5">{item.notas}</p>}
      </div>
      <form action={eliminar}>
        <button type="submit" title="Eliminar" className="p-1 hover:bg-[#ffdad6] rounded-lg transition-all">
          <span className="material-symbols-outlined text-[#ba1a1a] text-[16px]">close</span>
        </button>
      </form>
    </div>
  );
}
