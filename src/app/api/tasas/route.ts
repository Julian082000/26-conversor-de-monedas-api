import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const base = (req.nextUrl.searchParams.get("base") || "USD").toUpperCase();
  try {
    const res = await fetch(`https://open.er-api.com/v6/latest/${encodeURIComponent(base)}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) {
      return NextResponse.json({ error: "No se pudieron obtener las tasas" }, { status: 502 });
    }
    const data = await res.json();
    if (data.result !== "success" || !data.rates) {
      return NextResponse.json({ error: "Moneda base no soportada" }, { status: 400 });
    }
    const fecha = data.time_last_update_utc
      ? new Date(data.time_last_update_utc).toISOString().slice(0, 10)
      : new Date().toISOString().slice(0, 10);

    return NextResponse.json({
      base: data.base_code,
      fecha,
      valores: data.rates,
    });
  } catch {
    return NextResponse.json({ error: "Error conectando con proveedor de tasas" }, { status: 502 });
  }
}