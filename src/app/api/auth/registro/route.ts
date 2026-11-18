import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "nodejs";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const apiKey = process.env.FIREBASE_WEB_API_KEY;
  const res = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...parsed.data, returnSecureToken: true }),
    }
  );

  const data = await res.json();
  if (!res.ok) {
    const status = data.error?.message === "EMAIL_EXISTS" ? 409 : 400;
    return NextResponse.json({ error: "No se pudo registrar" }, { status });
  }

  return NextResponse.json(
    {
      token: data.idToken,
      refreshToken: data.refreshToken,
      expiraEnSeg: Number(data.expiresIn),
      usuario: { id: data.localId, email: data.email },
    },
    { status: 201 }
  );
}
