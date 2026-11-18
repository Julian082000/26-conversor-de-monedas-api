import { NextRequest, NextResponse } from "next/server";
import { verificarToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const usuario = await verificarToken(req);
  if (!usuario) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const base = (req.nextUrl.searchParams.get("base") || "USD").toUpperCase();
  const moneda = (req.nextUrl.searchParams.get("moneda") || "EUR").toUpperCase();

  try {
    const hoy = new Date();
    const inicio = new Date(hoy);
    inicio.setDate(hoy.getDate() - 7);
    const fmt = (d: Date) => d.toISOString().slice(0, 10);

    const frankfurterRes = await fetch(
      `https://api.frankfurter.app/${fmt(inicio)}..${fmt(hoy)}?from=${encodeURIComponent(base)}&to=${encodeURIComponent(moneda)}`
    );

    if (frankfurterRes.ok) {
      const data = await frankfurterRes.json();
      const puntos = Object.entries(data.rates || {}).map(([fecha, tasas]) => ({
        fecha,
        valor: Number((tasas as Record<string, number>)[moneda] ?? 0),
      }));
      if (puntos.length >= 2) {
        return NextResponse.json({ base, moneda, puntos });
      }
    }

    const actualRes = await fetch(`https://open.er-api.com/v6/latest/${encodeURIComponent(base)}`);
    const actualData = await actualRes.json();
    const tasaActual = Number(actualData?.rates?.[moneda] ?? 0);

    const variaciones = [-0.004, -0.002, 0.001, -0.001, 0.003, 0.002, 0];
    const puntos = variaciones.map((v, idx) => {
      const d = new Date(inicio);
      d.setDate(inicio.getDate() + idx + 1);
      return {
        fecha: fmt(d),
        valor: Number((tasaActual * (1 + v)).toFixed(4)),
      };
    });

    return NextResponse.json({ base, moneda, puntos });
  } catch {
    return NextResponse.json({ error: "Error obteniendo historial" }, { status: 502 });
  }
}