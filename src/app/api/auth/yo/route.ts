import { NextRequest, NextResponse } from "next/server";
import { verificarToken } from "@/lib/firebase";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const uid = await verificarToken(req);
  if (!uid) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  return NextResponse.json({ usuario: { id: uid } });
}
