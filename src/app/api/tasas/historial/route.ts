import { NextRequest, NextResponse } from "next/server";
import { verificarToken } from "@/lib/firebase";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const uid = await verificarToken(req);
  if (!uid) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const base = (req.nextUrl.searchParams.get("base") || "USD").toUpperCase();
  const moneda = (req.nextUrl.searchParams.get("moneda") || "EUR").toUpperCase();
  const fin = new Date();
  const inicio = new Date();
  inicio.setDate(fin.getDate() - 7);

  const fInicio = inicio.toISOString().slice(0, 10);
  const fFin = fin.toISOString().slice(0, 10);
  const url = `https://api.frankfurter.dev/v1/${fInicio}..${fFin}?base=${base}&symbols=${moneda}`;

  const res = await fetch(url);
  if (!res.ok) return NextResponse.json({ error: "Error en historial" }, { status: 502 });

  const data = await res.json();
  const puntos = Object.entries(data.rates || {}).map(([fecha, tasas]) => ({
    fecha,
    valor: (tasas as Record<string, number>)[moneda] ?? 0,
  }));

  return NextResponse.json({ base, moneda, puntos });
}
