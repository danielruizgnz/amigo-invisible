"use client";

import { useState, useTransition } from "react";
import { accionEliminarGrupo } from "./actions";

export default function BotonEliminarGrupo({ grupoId }: { grupoId: string }) {
  const [confirmando, setConfirmando] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleEliminar() {
    startTransition(async () => {
      await accionEliminarGrupo(grupoId);
    });
  }

  if (!confirmando) {
    return (
      <button
        onClick={() => setConfirmando(true)}
        className="inline-flex items-center gap-1.5 text-sm text-[#ba1a1a] bg-[#ffdad6]/50 hover:bg-[#ffdad6] px-4 py-2 rounded-xl transition-all"
      >
        <span className="material-symbols-outlined text-[18px]">delete</span>
        Eliminar sorteo
      </button>
    );
  }

  return (
    <div className="glass-card rounded-[16px] p-4 flex flex-col gap-3 border border-[#ffdad6]">
      <p className="text-sm font-medium text-[#191c1d]">
        ¿Eliminar este sorteo? Se borrarán todos los participantes y asignaciones. Esta acción no se puede deshacer.
      </p>
      <div className="flex gap-2 justify-end">
        <button
          onClick={() => setConfirmando(false)}
          className="px-4 py-2 text-sm text-[#414845] bg-[#eceeef] rounded-xl hover:bg-[#e6e8e9] transition-all"
        >
          Cancelar
        </button>
        <button
          onClick={handleEliminar}
          disabled={isPending}
          className="inline-flex items-center gap-1 px-4 py-2 text-sm bg-[#ba1a1a] text-white font-semibold rounded-xl hover:bg-[#ba1a1a]/90 transition-all disabled:opacity-60"
        >
          {isPending ? (
            <span className="material-symbols-outlined animate-spin text-[16px]">progress_activity</span>
          ) : (
            <span className="material-symbols-outlined text-[16px]">delete</span>
          )}
          {isPending ? "Eliminando..." : "Sí, eliminar"}
        </button>
      </div>
    </div>
  );
}
