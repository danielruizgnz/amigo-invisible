"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { accionAnadirExclusion } from "./actions";

interface Participante {
  usuario_id: string;
  usuario: { nombre: string };
}

interface Props {
  grupoId: string;
  participantes: Participante[];
}

export default function FormExclusion({ grupoId, participantes }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await accionAnadirExclusion(grupoId, formData);
      if (result?.error) setError(result.error);
      else router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="space-y-2">
        <div>
          <label className="block text-xs text-[#414845] mb-1">No quiero que...</label>
          <select
            name="de_id"
            required
            className="w-full px-3 py-2 bg-white/40 border border-[#c1c8c4] rounded-xl text-[#191c1d] text-sm focus:outline-none focus:border-[#6e5c31] transition-all"
          >
            <option value="">Selecciona persona</option>
            {participantes.map((p) => (
              <option key={p.usuario_id} value={p.usuario_id}>
                {p.usuario?.nombre}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-[#414845] mb-1">...regale a</label>
          <select
            name="a_id"
            required
            className="w-full px-3 py-2 bg-white/40 border border-[#c1c8c4] rounded-xl text-[#191c1d] text-sm focus:outline-none focus:border-[#6e5c31] transition-all"
          >
            <option value="">Selecciona persona</option>
            {participantes.map((p) => (
              <option key={p.usuario_id} value={p.usuario_id}>
                {p.usuario?.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <p className="text-xs text-[#93000a] bg-[#ffdad6] rounded-lg px-3 py-2">{error}</p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-[#e6ce99]/40 border border-[#6e5c31]/20 text-[#6e5c31] font-semibold text-xs py-2 rounded-xl hover:bg-[#e6ce99]/60 transition-all disabled:opacity-50 flex items-center justify-center gap-1"
      >
        <span className="material-symbols-outlined text-[16px]">add</span>
        Añadir exclusión
      </button>
    </form>
  );
}
