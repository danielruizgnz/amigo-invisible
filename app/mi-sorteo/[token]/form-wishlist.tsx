"use client";

import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";

interface Props {
  usuarioId: string;
  grupoId: string;
  token: string;
}

export default function FormWishlist({ usuarioId, grupoId, token }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [exito, setExito] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [expandido, setExpandido] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    const titulo = (formData.get("titulo") as string)?.trim();
    const url = (formData.get("url") as string)?.trim();
    const notas = (formData.get("notas") as string)?.trim();

    if (!titulo) {
      setError("El nombre del deseo es obligatorio.");
      return;
    }

    startTransition(async () => {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuarioId, grupoId, titulo, url: url || null, notas: notas || null }),
      });

      if (!res.ok) {
        setError("Error al guardar. Inténtalo de nuevo.");
        return;
      }

      setExito(true);
      formRef.current?.reset();
      setExpandido(false);
      setTimeout(() => setExito(false), 3000);
      router.refresh();
    });
  }

  if (!expandido) {
    return (
      <div className="space-y-3">
        {exito && (
          <p className="text-xs text-[#002019] bg-[#b5d8cc] rounded-lg px-3 py-2 flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">check_circle</span>
            Deseo añadido correctamente.
          </p>
        )}
        <button
          onClick={() => setExpandido(true)}
          className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-[#c1c8c4] rounded-xl py-3 text-sm text-[#717975] hover:border-[#45655b] hover:text-[#45655b] transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Añadir deseo
        </button>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-3 bg-white/30 rounded-xl p-4">
      <div>
        <label className="block text-xs font-semibold text-[#414845] mb-1 uppercase tracking-wide">
          Qué quieres *
        </label>
        <input
          name="titulo"
          type="text"
          required
          placeholder="Ej: Libro 'El Alquimista'"
          className="w-full px-3 py-2.5 bg-white/40 border border-[#c1c8c4] rounded-xl text-[#191c1d] placeholder-[#717975] text-sm focus:outline-none focus:border-[#6e5c31] focus:ring-2 focus:ring-[#6e5c31]/20 transition-all"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-[#414845] mb-1 uppercase tracking-wide">
          Enlace (opcional)
        </label>
        <input
          name="url"
          type="url"
          placeholder="https://..."
          className="w-full px-3 py-2.5 bg-white/40 border border-[#c1c8c4] rounded-xl text-[#191c1d] placeholder-[#717975] text-sm focus:outline-none focus:border-[#6e5c31] focus:ring-2 focus:ring-[#6e5c31]/20 transition-all"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-[#414845] mb-1 uppercase tracking-wide">
          Notas (opcional)
        </label>
        <textarea
          name="notas"
          rows={2}
          placeholder="Talla, color, preferencias..."
          className="w-full px-3 py-2.5 bg-white/40 border border-[#c1c8c4] rounded-xl text-[#191c1d] placeholder-[#717975] text-sm focus:outline-none focus:border-[#6e5c31] focus:ring-2 focus:ring-[#6e5c31]/20 transition-all resize-none"
        />
      </div>

      {error && (
        <p className="text-xs text-[#93000a] bg-[#ffdad6] rounded-lg px-3 py-2">{error}</p>
      )}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => { setExpandido(false); setError(null); }}
          className="flex-1 py-2.5 text-sm text-[#414845] bg-[#eceeef] rounded-xl hover:bg-[#e6e8e9] transition-all"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="flex-1 py-2.5 text-sm bg-[#45655b] text-white font-semibold rounded-xl hover:bg-[#45655b]/90 transition-all disabled:opacity-60 flex items-center justify-center gap-1"
        >
          {isPending ? (
            <span className="material-symbols-outlined animate-spin text-[16px]">progress_activity</span>
          ) : (
            <span className="material-symbols-outlined text-[16px]">add</span>
          )}
          Añadir
        </button>
      </div>
    </form>
  );
}
