"use client";

import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import { accionAnadirParticipante } from "./actions";

export default function FormAnadirParticipante({ grupoId }: { grupoId: string }) {
  const [error, setError] = useState<string | null>(null);
  const [exito, setExito] = useState(false);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setExito(false);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await accionAnadirParticipante(grupoId, formData);
      if (result?.error) {
        setError(result.error);
      } else {
        setExito(true);
        formRef.current?.reset();
        router.refresh();
        setTimeout(() => setExito(false), 3000);
      }
    });
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <input
            name="nombre"
            type="text"
            required
            placeholder="Nombre"
            className="w-full px-3 py-2.5 bg-white/40 border border-[#c1c8c4] rounded-xl text-[#191c1d] placeholder-[#717975] text-sm focus:outline-none focus:border-[#6e5c31] focus:ring-2 focus:ring-[#6e5c31]/20 transition-all"
          />
        </div>
        <div>
          <input
            name="telefono"
            type="tel"
            required
            placeholder="Teléfono (ej: +34...)"
            className="w-full px-3 py-2.5 bg-white/40 border border-[#c1c8c4] rounded-xl text-[#191c1d] placeholder-[#717975] text-sm focus:outline-none focus:border-[#6e5c31] focus:ring-2 focus:ring-[#6e5c31]/20 transition-all"
          />
        </div>
      </div>

      {error && (
        <p className="text-xs text-[#93000a] bg-[#ffdad6] rounded-lg px-3 py-2 flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px]">error</span>
          {error}
        </p>
      )}
      {exito && (
        <p className="text-xs text-[#002019] bg-[#b5d8cc] rounded-lg px-3 py-2 flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px]">check_circle</span>
          Participante añadido correctamente.
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-[#45655b]/10 border border-[#45655b]/30 text-[#45655b] font-semibold text-sm py-2.5 rounded-xl hover:bg-[#45655b]/20 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {isPending ? (
          <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
        ) : (
          <span className="material-symbols-outlined text-[18px]">person_add</span>
        )}
        {isPending ? "Añadiendo..." : "Añadir participante"}
      </button>
    </form>
  );
}
