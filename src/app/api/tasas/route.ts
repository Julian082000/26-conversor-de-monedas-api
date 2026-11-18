import { NextRequest, NextResponse } from "next/server";
import { getDb, verificarToken } from "@/lib/firebase";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const uid = await verificarToken(req);
  if (!uid) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const base = (req.nextUrl.searchParams.get("base") || "USD").toUpperCase();
  const hoy = new Date().toISOString().slice(0, 10);
  const db = getDb();
  const docRef = db.collection("tasas").doc(`${base}_${hoy}`);
  const snap = await docRef.get();

  if (snap.exists) {
    return NextResponse.json(snap.data());
  }

  const extRes = await fetch(`https://api.frankfurter.dev/v1/latest?base=${base}`);
  if (!extRes.ok) {
    return NextResponse.json({ error: "Error consultando tasas" }, { status: 502 });
  }

  const extData = await extRes.json();
  const payload = { base, fecha: extData.date || hoy, valores: extData.rates };
  await docRef.set(payload);

  return NextResponse.json(payload);
}
