import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/firebase";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Prohibido" }, { status: 403 });
  }

  const bases = ["USD", "EUR"];
  const db = getDb();

  for (const base of bases) {
    const res = await fetch(`https://api.frankfurter.dev/v1/latest?base=${base}`);
    if (res.ok) {
      const data = await res.json();
      await db.collection("tasas").doc(`${base}_${data.date}`).set({
        base,
        fecha: data.date,
        valores: data.rates,
      });
    }
  }

  return NextResponse.json({ ok: true });
}
