import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getDb, verificarToken } from "@/lib/firebase";

export const runtime = "nodejs";

const schema = z.object({
  base: z.string().length(3),
  destino: z.string().length(3),
});

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const uid = await verificarToken(req);
  if (!uid) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });

  const ahora = new Date().toISOString();
  const docData = {
    base: parsed.data.base.toUpperCase(),
    destino: parsed.data.destino.toUpperCase(),
    created_at: ahora,
    updated_at: ahora,
    deleted_at: null,
  };

  await getDb().collection("usuarios").doc(uid).collection("par_favorito").doc(id).set(docData);
  return NextResponse.json({ id, ...docData });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const uid = await verificarToken(req);
  if (!uid) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await params;
  const ahora = new Date().toISOString();
  await getDb()
    .collection("usuarios")
    .doc(uid)
    .collection("par_favorito")
    .doc(id)
    .set({ updated_at: ahora, deleted_at: ahora }, { merge: true });

  return NextResponse.json({ ok: true });
}
