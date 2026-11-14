import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "nodejs";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
  }

  const apiKey = process.env.FIREBASE_WEB_API_KEY;
  const res = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...parsed.data, returnSecureToken: true }),
    }
  );

  const data = await res.json();
  if (!res.ok) {
    return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
  }

  return NextResponse.json({
    token: data.idToken,
    refreshToken: data.refreshToken,
    expiraEnSeg: Number(data.expiresIn),
    usuario: { id: data.localId, email: data.email },
  });
}
