"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { accionLanzarSorteo } from "./actions";

interface Props {
  grupoId: string;
  totalParticipantes: number;
}

export default function BotonSortear({ grupoId, totalParticipantes }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [confirmando, setConfirmando] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  async function handleSortear() {
    setError(null);
    startTransition(async () => {
      const result = await accionLanzarSorteo(grupoId);
      if (result?.error) {
        setError(result.error);
        setConfirmando(false);
      } else {
        router.refresh();
      }
    });
  }

  if (totalParticipantes < 2) {
    return (
      <p className="text-sm text-[#717975] bg-[#eceeef] rounded-xl px-4 py-2">
        Necesitas al menos 2 participantes
      </p>
    );
  }

  return (
    <div className="flex flex-col items-end gap-2">
      {!confirmando ? (
        <button
          onClick={() => setConfirmando(true)}
          className="inline-flex items-center gap-2 bg-[#6e5c31] text-white font-semibold text-sm px-6 py-3 rounded-xl inner-glow-gold hover:bg-[#6e5c31]/90 active:scale-[0.98] transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
          Lanzar sorteo
        </button>
      ) : (
        <div className="glass-card rounded-[16px] p-4 text-right space-y-3">
          <p className="text-sm font-medium text-[#191c1d]">
            ¿Confirmar sorteo? Esta acción no se puede deshacer.
          </p>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setConfirmando(false)}
              className="px-4 py-2 text-sm text-[#414845] bg-[#eceeef] rounded-xl hover:bg-[#e6e8e9] transition-all"
            >
              Cancelar
            </button>
            <button
              onClick={handleSortear}
              disabled={isPending}
              className="inline-flex items-center gap-1 px-4 py-2 text-sm bg-[#6e5c31] text-white font-semibold rounded-xl hover:bg-[#6e5c31]/90 transition-all disabled:opacity-60"
            >
              {isPending ? (
                <span className="material-symbols-outlined animate-spin text-[16px]">progress_activity</span>
              ) : (
                <span className="material-symbols-outlined text-[16px]">check</span>
              )}
              {isPending ? "Sorteando..." : "Confirmar"}
            </button>
          </div>
        </div>
      )}
      {error && (
        <p className="text-xs text-[#93000a] bg-[#ffdad6] rounded-lg px-3 py-2 flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px]">error</span>
          {error}
        </p>
      )}
    </div>
  );
}
