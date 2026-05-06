import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { usuarioId, grupoId, titulo, url, notas } = body;

    if (!usuarioId || !grupoId || !titulo?.trim()) {
      return NextResponse.json({ error: "Datos incompletos." }, { status: 400 });
    }

    // Verificar que el usuario es participante del grupo
    const { data: esPart } = await supabaseAdmin
      .from("participantes")
      .select("id")
      .eq("usuario_id", usuarioId)
      .eq("grupo_id", grupoId)
      .single();

    if (!esPart) {
      return NextResponse.json({ error: "No autorizado." }, { status: 403 });
    }

    const { error } = await supabaseAdmin.from("items_deseos").insert({
      usuario_id: usuarioId,
      grupo_id: grupoId,
      titulo: titulo.trim(),
      url: url || null,
      notas: notas || null,
    });

    if (error) {
      return NextResponse.json({ error: "Error al guardar." }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Error interno." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get("id");
    const usuarioId = searchParams.get("usuarioId");

    if (!itemId || !usuarioId) {
      return NextResponse.json({ error: "Datos incompletos." }, { status: 400 });
    }

    await supabaseAdmin
      .from("items_deseos")
      .delete()
      .eq("id", itemId)
      .eq("usuario_id", usuarioId);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Error interno." }, { status: 500 });
  }
}
