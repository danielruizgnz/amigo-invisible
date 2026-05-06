import { redirect } from "next/navigation";
import { getUsuarioSesion } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import Link from "next/link";

async function crearGrupo(formData: FormData) {
  "use server";
  const usuario = await getUsuarioSesion();
  if (!usuario) redirect("/entrar");

  const nombre = (formData.get("nombre") as string)?.trim();
  const fechaEvento = formData.get("fecha_evento") as string;
  const presupuesto = formData.get("presupuesto") as string;

  if (!nombre) return;

  const { data: grupo, error } = await supabaseAdmin
    .from("grupos")
    .insert({
      nombre,
      organizador_id: usuario.id,
      fecha_evento: fechaEvento || null,
      presupuesto: presupuesto ? parseFloat(presupuesto) : null,
      estado: "pendiente",
    })
    .select()
    .single();

  if (error || !grupo) return;

  // El organizador también es participante
  await supabaseAdmin.from("participantes").insert({
    grupo_id: grupo.id,
    usuario_id: usuario.id,
  });

  redirect(`/grupos/${grupo.id}`);
}

export default async function PaginaNuevoGrupo() {
  const usuario = await getUsuarioSesion();
  if (!usuario) redirect("/entrar");

  return (
    <div className="max-w-lg mx-auto pt-6 space-y-6">
      <div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 text-sm text-[#414845] hover:text-[#45655b] transition-colors mb-4"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Volver al dashboard
        </Link>
        <h1
          className="text-3xl font-medium text-[#191c1d]"
          style={{ fontFamily: "var(--font-epilogue)" }}
        >
          Crear nuevo sorteo
        </h1>
        <p className="text-[#414845] mt-1">
          Configura los detalles básicos. Después podrás añadir participantes.
        </p>
      </div>

      <div className="glass-card rounded-[24px] p-8">
        <form action={crearGrupo} className="space-y-6">
          {/* Nombre */}
          <div>
            <label
              htmlFor="nombre"
              className="block text-xs font-semibold text-[#414845] mb-1.5 tracking-wide uppercase"
            >
              Nombre del sorteo *
            </label>
            <input
              id="nombre"
              name="nombre"
              type="text"
              required
              placeholder="Ej: Amigo Invisible Familia 2024"
              className="w-full px-4 py-3 bg-white/40 border border-[#c1c8c4] rounded-xl text-[#191c1d] placeholder-[#717975] text-sm focus:outline-none focus:border-[#6e5c31] focus:ring-2 focus:ring-[#6e5c31]/20 transition-all"
            />
          </div>

          {/* Fecha */}
          <div>
            <label
              htmlFor="fecha_evento"
              className="block text-xs font-semibold text-[#414845] mb-1.5 tracking-wide uppercase"
            >
              Fecha del evento
            </label>
            <input
              id="fecha_evento"
              name="fecha_evento"
              type="date"
              className="w-full px-4 py-3 bg-white/40 border border-[#c1c8c4] rounded-xl text-[#191c1d] text-sm focus:outline-none focus:border-[#6e5c31] focus:ring-2 focus:ring-[#6e5c31]/20 transition-all"
            />
            <p className="mt-1 text-xs text-[#717975]">Opcional — para recordar cuándo es el intercambio.</p>
          </div>

          {/* Presupuesto */}
          <div>
            <label
              htmlFor="presupuesto"
              className="block text-xs font-semibold text-[#414845] mb-1.5 tracking-wide uppercase"
            >
              Presupuesto máximo (€)
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#717975] text-[20px]">
                payments
              </span>
              <input
                id="presupuesto"
                name="presupuesto"
                type="number"
                min="1"
                step="0.01"
                placeholder="Ej: 30"
                className="w-full pl-10 pr-4 py-3 bg-white/40 border border-[#c1c8c4] rounded-xl text-[#191c1d] placeholder-[#717975] text-sm focus:outline-none focus:border-[#6e5c31] focus:ring-2 focus:ring-[#6e5c31]/20 transition-all"
              />
            </div>
            <p className="mt-1 text-xs text-[#717975]">Opcional — límite de gasto orientativo por participante.</p>
          </div>

          <button
            type="submit"
            className="w-full bg-[#45655b] text-white font-semibold text-sm py-3 rounded-xl hover:bg-[#45655b]/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            Crear y añadir participantes
          </button>
        </form>
      </div>
    </div>
  );
}
