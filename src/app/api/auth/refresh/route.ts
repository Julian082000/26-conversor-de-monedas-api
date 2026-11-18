import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "nodejs";

const schema = z.object({ refreshToken: z.string().min(1) });

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Token inválido" }, { status: 400 });
  }

  const apiKey = process.env.FIREBASE_WEB_API_KEY;
  const res = await fetch(`https://securetoken.googleapis.com/v1/token?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ grant_type: "refresh_token", refresh_token: parsed.data.refreshToken }),
  });

  const data = await res.json();
  if (!res.ok) {
    return NextResponse.json({ error: "Sesión expirada" }, { status: 401 });
  }

  return NextResponse.json({
    token: data.id_token,
    refreshToken: data.refresh_token,
    expiraEnSeg: Number(data.expires_in),
  });
}
