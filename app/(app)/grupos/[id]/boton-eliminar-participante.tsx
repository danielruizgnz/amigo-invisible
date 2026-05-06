"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { accionEliminarParticipante } from "./actions";

export default function BotonEliminarParticipante({
  grupoId,
  participanteId,
}: {
  grupoId: string;
  participanteId: string;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <button
      onClick={() =>
        startTransition(async () => {
          await accionEliminarParticipante(grupoId, participanteId);
          router.refresh();
        })
      }
      disabled={isPending}
      title="Eliminar participante"
      className="p-1.5 hover:bg-[#ffdad6] rounded-lg transition-all disabled:opacity-50"
    >
      <span className="material-symbols-outlined text-[#ba1a1a] text-[18px]">person_remove</span>
    </button>
  );
}
