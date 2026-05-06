import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="snow-bg min-h-screen overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-white/60 backdrop-blur-xl border-b border-white/20 shadow-[0_8px_32px_0_rgba(115,87,93,0.1)]">
        <div className="flex justify-between items-center px-5 py-6 max-w-7xl mx-auto">
          <span
            className="text-2xl font-semibold text-[#45655b]"
            style={{ fontFamily: "var(--font-epilogue)" }}
          >
            Amigo Invisible
          </span>
          <div className="flex items-center gap-3">
            <Link
              href="/entrar"
              className="text-[#45655b] font-semibold text-sm border border-[#45655b]/30 px-5 py-2 rounded-full hover:bg-[#45655b]/10 transition-all"
            >
              Entrar
            </Link>
            <Link
              href="/entrar"
              className="bg-[#45655b] text-white font-semibold text-sm px-5 py-2 rounded-full hover:scale-95 transition-all"
            >
              Crear Sorteo
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-24">
        {/* Hero */}
        <section className="relative px-5 py-20 flex flex-col items-center justify-center overflow-hidden">
          {/* Decorative snowflakes */}
          <div className="absolute top-20 left-10 opacity-20 text-[#b5d8cc] pointer-events-none">
            <span className="material-symbols-outlined text-[120px]">ac_unit</span>
          </div>
          <div className="absolute bottom-10 right-10 opacity-20 text-[#e6ce99] pointer-events-none">
            <span className="material-symbols-outlined text-[160px]">ac_unit</span>
          </div>
          <div className="absolute top-1/2 left-1/4 opacity-10 text-[#ffd9e0] pointer-events-none">
            <span className="material-symbols-outlined text-[80px]">ac_unit</span>
          </div>

          <div className="relative z-10 w-full max-w-4xl bg-white/40 backdrop-blur-3xl rounded-[32px] border border-white/60 p-12 shadow-[0_24px_64px_-12px_rgba(115,87,93,0.15)] glass-glow flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-6 text-center md:text-left">
              <span className="inline-block bg-[#f9e0aa] text-[#251a00] px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase">
                Sorteo Navideño
              </span>
              <h1
                className="text-5xl font-semibold text-[#45655b] leading-tight"
                style={{ fontFamily: "var(--font-epilogue)", letterSpacing: "-0.02em" }}
              >
                Magia navideña en cada regalo
              </h1>
              <p className="text-lg text-[#414845] max-w-lg leading-relaxed">
                Organiza tu Amigo Invisible de forma moderna, rápida y con estilo. Crea un grupo, añade a tus amigos y lanza el sorteo en segundos.
              </p>
              <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                <Link
                  href="/entrar"
                  className="bg-[#45655b] text-white px-10 py-4 rounded-full font-semibold text-sm shadow-lg hover:bg-[#6e5c31] transition-all hover:scale-105 text-center"
                >
                  Crear Sorteo Gratis
                </Link>
                <a
                  href="#como-funciona"
                  className="bg-white/20 backdrop-blur-md border border-[#73575d]/20 text-[#73575d] px-10 py-4 rounded-full font-semibold text-sm hover:bg-white/40 transition-all text-center"
                >
                  Cómo funciona
                </a>
              </div>
            </div>

            {/* Gift icon card */}
            <div className="flex-shrink-0 w-64 h-64 relative group">
              <div className="absolute inset-0 bg-[#b5d8cc]/20 rounded-full blur-3xl group-hover:bg-[#e6ce99]/30 transition-all duration-700" />
              <div className="relative z-10 w-full h-full glass-card rounded-[48px] flex flex-col items-center justify-center gap-4 p-8">
                <span
                  className="material-symbols-outlined text-[#6e5c31] icon-filled"
                  style={{ fontSize: 80 }}
                >
                  card_giftcard
                </span>
                <p
                  className="text-[#45655b] font-semibold text-center text-sm"
                  style={{ fontFamily: "var(--font-epilogue)" }}
                >
                  ¿Quién será tu amigo invisible?
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Cómo funciona */}
        <section id="como-funciona" className="max-w-7xl mx-auto px-5 py-20">
          <h2
            className="text-3xl font-medium text-center text-[#191c1d] mb-12"
            style={{ fontFamily: "var(--font-epilogue)" }}
          >
            Cómo funciona
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: "group_add",
                titulo: "1. Crea tu grupo",
                desc: "Regístrate con tu nombre y teléfono, crea un grupo y añade a todos los participantes.",
                color: "bg-[#b5d8cc]/30",
                iconColor: "text-[#45655b]",
              },
              {
                icon: "shuffle",
                titulo: "2. Lanza el sorteo",
                desc: "Con un clic, el algoritmo asigna de forma aleatoria y justa, respetando las exclusiones que configures.",
                color: "bg-[#ffd9e0]/30",
                iconColor: "text-[#73575d]",
              },
              {
                icon: "celebration",
                titulo: "3. Descubre tu asignado",
                desc: "Cada participante recibe un enlace único y secreto. Puedes ver el nombre de tu asignado y su lista de deseos.",
                color: "bg-[#e6ce99]/30",
                iconColor: "text-[#6e5c31]",
              },
            ].map((paso) => (
              <div
                key={paso.titulo}
                className={`${paso.color} backdrop-blur-xl border border-white/40 p-8 rounded-[32px] flex flex-col gap-4`}
              >
                <div className="w-12 h-12 rounded-xl bg-white/80 flex items-center justify-center shadow-sm">
                  <span className={`material-symbols-outlined ${paso.iconColor}`}>
                    {paso.icon}
                  </span>
                </div>
                <h3
                  className="text-xl font-medium text-[#191c1d]"
                  style={{ fontFamily: "var(--font-epilogue)" }}
                >
                  {paso.titulo}
                </h3>
                <p className="text-[#414845] text-base leading-relaxed">{paso.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Features bento */}
        <section className="max-w-7xl mx-auto px-5 py-10 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card rounded-[32px] p-8 flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#c7eade] flex items-center justify-center">
                <span className="material-symbols-outlined text-[#45655b]">encrypted</span>
              </div>
              <h3
                className="text-2xl font-medium text-[#45655b]"
                style={{ fontFamily: "var(--font-epilogue)" }}
              >
                Sorteo anónimo y justo
              </h3>
              <p className="text-[#414845]">
                Nadie sabe quién regala a quién hasta el gran día. El algoritmo garantiza que nadie se asigne a sí mismo ni a personas excluidas.
              </p>
            </div>

            <div className="glass-card rounded-[32px] p-8 flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#ffd9e0] flex items-center justify-center">
                <span className="material-symbols-outlined text-[#73575d]">format_list_bulleted</span>
              </div>
              <h3
                className="text-2xl font-medium text-[#73575d]"
                style={{ fontFamily: "var(--font-epilogue)" }}
              >
                Lista de deseos opcional
              </h3>
              <p className="text-[#414845]">
                Cada participante puede crear su lista de deseos. El amigo invisible podrá verla para inspirarse con el regalo perfecto.
              </p>
            </div>

            <div className="glass-card rounded-[32px] p-8 flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#e6ce99] flex items-center justify-center">
                <span className="material-symbols-outlined text-[#6e5c31]">rule</span>
              </div>
              <h3
                className="text-2xl font-medium text-[#6e5c31]"
                style={{ fontFamily: "var(--font-epilogue)" }}
              >
                Exclusiones personalizadas
              </h3>
              <p className="text-[#414845]">
                ¿Hay parejas en el grupo? Configura exclusiones para que A nunca regale a B. El algoritmo lo respeta siempre.
              </p>
            </div>

            <div className="glass-card rounded-[32px] p-8 flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#b5d8cc] flex items-center justify-center">
                <span className="material-symbols-outlined text-[#45655b]">link</span>
              </div>
              <h3
                className="text-2xl font-medium text-[#45655b]"
                style={{ fontFamily: "var(--font-epilogue)" }}
              >
                Enlace único por participante
              </h3>
              <p className="text-[#414845]">
                Comparte el enlace por WhatsApp. Cada participante accede con su enlace personal y descubre quién es su amigo invisible.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-5 pb-20">
          <div className="max-w-4xl mx-auto bg-[#45655b] text-white rounded-[48px] p-12 md:p-16 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <span className="material-symbols-outlined text-[300px] absolute -top-20 -left-20 rotate-45">ac_unit</span>
              <span className="material-symbols-outlined text-[200px] absolute -bottom-10 -right-10">forest</span>
            </div>
            <div className="relative z-10 space-y-6">
              <h2
                className="text-4xl md:text-5xl font-semibold"
                style={{ fontFamily: "var(--font-epilogue)", letterSpacing: "-0.02em" }}
              >
                ¿Listo para repartir alegría?
              </h2>
              <p className="text-white/80 text-lg max-w-xl mx-auto">
                Gratis, sin publicidad, sin límites. Crea tu sorteo en menos de 2 minutos.
              </p>
              <Link
                href="/entrar"
                className="inline-block mt-4 bg-white text-[#45655b] px-12 py-4 rounded-full font-semibold text-sm hover:bg-[#f9e0aa] hover:text-[#251a00] transition-all shadow-xl"
              >
                Empezar Ahora
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#f2f4f5] w-full py-12 px-5 border-t border-[#c1c8c4]">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 max-w-7xl mx-auto">
          <div className="flex flex-col items-center md:items-start gap-1">
            <span
              className="font-bold text-[#45655b] text-sm"
              style={{ fontFamily: "var(--font-epilogue)" }}
            >
              Amigo Invisible
            </span>
            <p className="text-[#414845] text-sm">© 2024 · Hecho con alegría navideña</p>
          </div>
          <p className="text-[#717975] text-sm">100% gratuito · Sin publicidad · Sin registro de email</p>
        </div>
      </footer>
    </div>
  );
}
