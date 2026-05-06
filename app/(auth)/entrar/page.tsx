import Link from "next/link";
import { accionEntrar } from "./actions";
import FormularioEntrar from "./formulario";

export default function PaginaEntrar() {
  return (
    <div className="snow-bg min-h-screen flex flex-col items-center justify-center px-5 relative overflow-hidden">
      {/* Decorativas */}
      <div className="absolute top-10 left-10 opacity-15 text-[#b5d8cc] pointer-events-none">
        <span className="material-symbols-outlined text-[100px]">ac_unit</span>
      </div>
      <div className="absolute bottom-10 right-10 opacity-15 text-[#e6ce99] pointer-events-none">
        <span className="material-symbols-outlined text-[140px]">ac_unit</span>
      </div>

      {/* Logo */}
      <Link
        href="/"
        className="mb-8 text-2xl font-semibold text-[#45655b] hover:opacity-80 transition-opacity"
        style={{ fontFamily: "var(--font-epilogue)" }}
      >
        Amigo Invisible
      </Link>

      {/* Card */}
      <div className="glass-card rounded-[32px] p-8 md:p-10 w-full max-w-md glass-glow">
        {/* Gift icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-[#c7eade] flex items-center justify-center">
            <span
              className="material-symbols-outlined text-[#45655b] icon-filled"
              style={{ fontSize: 36 }}
            >
              card_giftcard
            </span>
          </div>
        </div>

        <h1
          className="text-2xl font-medium text-center text-[#191c1d] mb-1"
          style={{ fontFamily: "var(--font-epilogue)" }}
        >
          Bienvenido/a
        </h1>
        <p className="text-sm text-center text-[#414845] mb-8">
          Introduce tu nombre y teléfono para entrar o registrarte.
        </p>

        <FormularioEntrar action={accionEntrar} />

        <p className="mt-6 text-xs text-center text-[#717975]">
          Al entrar, aceptas que guardaremos tu nombre y teléfono para gestionar el sorteo. Sin spam, sin publicidad.
        </p>
      </div>
    </div>
  );
}
