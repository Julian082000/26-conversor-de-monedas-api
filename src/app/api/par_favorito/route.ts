import { NextRequest, NextResponse } from "next/server";
import { getDb, verificarToken } from "@/lib/firebase";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const uid = await verificarToken(req);
  if (!uid) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const since = req.nextUrl.searchParams.get("since") || "1970-01-01T00:00:00.000Z";
  const db = getDb();
  const snap = await db
    .collection("usuarios")
    .doc(uid)
    .collection("par_favorito")
    .where("updated_at", ">", since)
    .limit(500)
    .get();

  const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  return NextResponse.json({ items, servidor_ahora: new Date().toISOString() });
}
