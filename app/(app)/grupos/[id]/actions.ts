"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getUsuarioSesion } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { sortearAmigoInvisible } from "@/lib/draw";

function normalizarTelefono(tel: string): string {
  return tel.replace(/\s+/g, "").replace(/[^+\d]/g, "");
}

export async function accionAnadirParticipante(grupoId: string, formData: FormData) {
  const usuario = await getUsuarioSesion();
  if (!usuario) redirect("/entrar");

  const nombre = (formData.get("nombre") as string)?.trim();
  const telefono = normalizarTelefono(formData.get("telefono") as string);

  if (!nombre || !telefono) return { error: "Completa nombre y teléfono." };
  if (telefono.length < 9) return { error: "Teléfono no válido." };

  // Verificar que el usuario es organizador del grupo
  const { data: grupo } = await supabaseAdmin
    .from("grupos")
    .select("*")
    .eq("id", grupoId)
    .eq("organizador_id", usuario.id)
    .single();

  if (!grupo) return { error: "No tienes permiso para modificar este sorteo." };
  if (grupo.estado === "sorteado") return { error: "El sorteo ya ha sido lanzado." };

  // Buscar o crear usuario por teléfono
  let participanteUsuario;
  const { data: existente } = await supabaseAdmin
    .from("usuarios")
    .select("*")
    .eq("telefono", telefono)
    .single();

  if (existente) {
    participanteUsuario = existente;
  } else {
    const { data: nuevo, error } = await supabaseAdmin
      .from("usuarios")
      .insert({ nombre, telefono })
      .select()
      .single();
    if (error || !nuevo) return { error: "Error al crear el participante." };
    participanteUsuario = nuevo;
  }

  // Evitar duplicados en el grupo
  const { data: yaEsta } = await supabaseAdmin
    .from("participantes")
    .select("id")
    .eq("grupo_id", grupoId)
    .eq("usuario_id", participanteUsuario.id)
    .single();

  if (yaEsta) return { error: "Esta persona ya está en el sorteo." };

  const { error: errInsertar } = await supabaseAdmin
    .from("participantes")
    .insert({ grupo_id: grupoId, usuario_id: participanteUsuario.id });

  if (errInsertar) return { error: "Error al añadir al participante." };

  revalidatePath(`/grupos/${grupoId}`);
  return { ok: true };
}

export async function accionEliminarParticipante(grupoId: string, participanteId: string) {
  const usuario = await getUsuarioSesion();
  if (!usuario) redirect("/entrar");

  const { data: grupo } = await supabaseAdmin
    .from("grupos")
    .select("*")
    .eq("id", grupoId)
    .eq("organizador_id", usuario.id)
    .single();

  if (!grupo || grupo.estado === "sorteado") return { error: "No se puede modificar." };

  // No permitir eliminar al organizador
  const { data: part } = await supabaseAdmin
    .from("participantes")
    .select("usuario_id")
    .eq("id", participanteId)
    .single();

  if (part?.usuario_id === usuario.id) return { error: "No puedes eliminarte como organizador." };

  await supabaseAdmin.from("participantes").delete().eq("id", participanteId);
  revalidatePath(`/grupos/${grupoId}`);
  return { ok: true };
}

export async function accionAnadirExclusion(grupoId: string, formData: FormData) {
  const usuario = await getUsuarioSesion();
  if (!usuario) redirect("/entrar");

  const { data: grupo } = await supabaseAdmin
    .from("grupos")
    .select("*")
    .eq("id", grupoId)
    .eq("organizador_id", usuario.id)
    .single();

  if (!grupo || grupo.estado === "sorteado") return { error: "No se puede modificar." };

  const deId = formData.get("de_id") as string;
  const aId = formData.get("a_id") as string;

  if (!deId || !aId || deId === aId) return { error: "Selecciona dos personas distintas." };

  await supabaseAdmin.from("exclusiones").upsert({
    grupo_id: grupoId,
    de_usuario_id: deId,
    a_usuario_id: aId,
  });

  revalidatePath(`/grupos/${grupoId}`);
  return { ok: true };
}

export async function accionEliminarExclusion(grupoId: string, exclusionId: string) {
  const usuario = await getUsuarioSesion();
  if (!usuario) redirect("/entrar");

  const { data: grupo } = await supabaseAdmin
    .from("grupos")
    .select("organizador_id")
    .eq("id", grupoId)
    .single();

  if (grupo?.organizador_id !== usuario.id) return;

  await supabaseAdmin.from("exclusiones").delete().eq("id", exclusionId);
  revalidatePath(`/grupos/${grupoId}`);
}

export async function accionLanzarSorteo(grupoId: string) {
  const usuario = await getUsuarioSesion();
  if (!usuario) redirect("/entrar");

  const { data: grupo } = await supabaseAdmin
    .from("grupos")
    .select("*")
    .eq("id", grupoId)
    .eq("organizador_id", usuario.id)
    .single();

  if (!grupo) return { error: "No tienes permiso." };
  if (grupo.estado === "sorteado") return { error: "El sorteo ya fue lanzado." };

  // Obtener participantes
  const { data: participantes } = await supabaseAdmin
    .from("participantes")
    .select("id, usuario_id")
    .eq("grupo_id", grupoId);

  if (!participantes || participantes.length < 2) {
    return { error: "Necesitas al menos 2 participantes para sortear." };
  }

  // Obtener exclusiones
  const { data: exclusiones } = await supabaseAdmin
    .from("exclusiones")
    .select("de_usuario_id, a_usuario_id")
    .eq("grupo_id", grupoId);

  const idsUsuarios = participantes.map((p) => p.usuario_id);
  const excs = (exclusiones ?? []).map((e) => ({
    de: e.de_usuario_id,
    a: e.a_usuario_id,
  }));

  // Ejecutar el sorteo
  const asignaciones = sortearAmigoInvisible(idsUsuarios, excs);

  if (!asignaciones) {
    return {
      error:
        "No se pudo encontrar un sorteo válido con las exclusiones actuales. Reduce las exclusiones e inténtalo de nuevo.",
    };
  }

  // Guardar asignaciones
  const updates = participantes.map((p) => ({
    id: p.id,
    asignado_a_id: asignaciones.get(p.usuario_id),
  }));

  for (const upd of updates) {
    await supabaseAdmin
      .from("participantes")
      .update({ asignado_a_id: upd.asignado_a_id })
      .eq("id", upd.id);
  }

  // Marcar grupo como sorteado
  await supabaseAdmin
    .from("grupos")
    .update({ estado: "sorteado" })
    .eq("id", grupoId);

  revalidatePath(`/grupos/${grupoId}`);
  return { ok: true };
}
