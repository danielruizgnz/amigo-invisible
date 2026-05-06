"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { accionEliminarExclusion } from "./actions";

export default function BotonEliminarExclusion({
  grupoId,
  exclusionId,
}: {
  grupoId: string;
  exclusionId: string;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <button
      onClick={() =>
        startTransition(async () => {
          await accionEliminarExclusion(grupoId, exclusionId);
          router.refresh();
        })
      }
      disabled={isPending}
      title="Eliminar exclusión"
      className="flex-shrink-0 p-1 hover:bg-[#ffdad6] rounded-lg transition-all disabled:opacity-50"
    >
      <span className="material-symbols-outlined text-[#ba1a1a] text-[16px]">close</span>
    </button>
  );
}
