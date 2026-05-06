"use server";

import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase";
import { getSession } from "@/lib/auth";

function normalizarTelefono(tel: string): string {
  return tel.replace(/\s+/g, "").replace(/[^+\d]/g, "");
}

export async function accionEntrar(formData: FormData) {
  const nombre = (formData.get("nombre") as string)?.trim();
  const telefono = normalizarTelefono(formData.get("telefono") as string);

  if (!nombre || !telefono) {
    return { error: "Por favor, completa todos los campos." };
  }

  if (telefono.length < 9) {
    return { error: "El número de teléfono no parece válido." };
  }

  // Buscar si el teléfono ya existe
  const { data: usuarioExistente, error: errBuscar } = await supabaseAdmin
    .from("usuarios")
    .select("*")
    .eq("telefono", telefono)
    .single();

  let usuario;

  if (errBuscar && errBuscar.code !== "PGRST116") {
    return { error: "Error al acceder a la base de datos. Inténtalo de nuevo." };
  }

  if (usuarioExistente) {
    // Usuario ya registrado: iniciar sesión
    usuario = usuarioExistente;
  } else {
    // Nuevo usuario: registrar
    const { data: nuevoUsuario, error: errCrear } = await supabaseAdmin
      .from("usuarios")
      .insert({ nombre, telefono })
      .select()
      .single();

    if (errCrear || !nuevoUsuario) {
      return { error: "No se pudo crear la cuenta. Inténtalo de nuevo." };
    }

    usuario = nuevoUsuario;
  }

  // Guardar sesión
  const session = await getSession();
  session.usuario = { id: usuario.id, nombre: usuario.nombre, telefono: usuario.telefono };
  await session.save();

  redirect("/dashboard");
}

export async function accionCerrarSesion() {
  const session = await getSession();
  session.destroy();
  redirect("/entrar");
}
