"use client";

import { useState, useTransition } from "react";

interface Props {
  action: (formData: FormData) => Promise<{ error: string } | undefined>;
}

export default function FormularioEntrar({ action }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await action(formData);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label
          htmlFor="nombre"
          className="block text-xs font-semibold text-[#414845] mb-1.5 tracking-wide uppercase"
        >
          Tu nombre
        </label>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#717975] text-[20px]">
            person
          </span>
          <input
            id="nombre"
            name="nombre"
            type="text"
            required
            placeholder="Ej: María García"
            autoComplete="name"
            className="w-full pl-10 pr-4 py-3 bg-white/40 border border-[#c1c8c4] rounded-xl text-[#191c1d] placeholder-[#717975] text-sm focus:outline-none focus:border-[#6e5c31] focus:ring-2 focus:ring-[#6e5c31]/20 transition-all"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="telefono"
          className="block text-xs font-semibold text-[#414845] mb-1.5 tracking-wide uppercase"
        >
          Número de teléfono
        </label>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#717975] text-[20px]">
            phone
          </span>
          <input
            id="telefono"
            name="telefono"
            type="tel"
            required
            placeholder="Ej: +34 612 345 678"
            autoComplete="tel"
            className="w-full pl-10 pr-4 py-3 bg-white/40 border border-[#c1c8c4] rounded-xl text-[#191c1d] placeholder-[#717975] text-sm focus:outline-none focus:border-[#6e5c31] focus:ring-2 focus:ring-[#6e5c31]/20 transition-all"
          />
        </div>
        <p className="mt-1 text-xs text-[#717975]">Incluye el prefijo del país (ej: +34 para España)</p>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-[#ffdad6] text-[#93000a] rounded-xl px-4 py-3 text-sm">
          <span className="material-symbols-outlined text-[18px]">error</span>
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-[#45655b] text-white font-semibold text-sm py-3 rounded-xl hover:bg-[#45655b]/90 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isPending ? (
          <>
            <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
            Entrando...
          </>
        ) : (
          <>
            <span className="material-symbols-outlined text-[18px]">login</span>
            Entrar
          </>
        )}
      </button>
    </form>
  );
}
