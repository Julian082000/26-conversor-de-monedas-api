import { describe, it, expect, vi } from "vitest";
import { NextRequest } from "next/server";
import { GET as getTasas } from "../src/app/api/tasas/route";
import { POST as postRegistro } from "../src/app/api/auth/registro/route";
import { PUT as putFavorito } from "../src/app/api/par_favorito/[id]/route";

vi.mock("../src/lib/firebase", () => ({
  verificarToken: vi.fn(async (req: NextRequest) =>
    req.headers.get("authorization") === "Bearer valido" ? "user-1" : null
  ),
  getDb: vi.fn(() => ({
    collection: () => ({ doc: () => ({ collection: () => ({ doc: () => ({ set: vi.fn() }) }) }) }),
  })),
}));

describe("Pruebas de seguridad y validación de la API", () => {
  it("1. Retorna 401 cuando no se envía token", async () => {
    const req = new NextRequest("http://localhost/api/tasas?base=USD");
    const res = await getTasas(req);
    expect(res.status).toBe(401);
  });

  it("2. Retorna 400 cuando el registro tiene contraseña corta", async () => {
    const req = new NextRequest("http://localhost/api/auth/registro", {
      method: "POST",
      body: JSON.stringify({ email: "test@correo.com", password: "123" }),
    });
    const res = await postRegistro(req);
    expect(res.status).toBe(400);
  });

  it("3. Guarda favorito solo para el usuario autenticado", async () => {
    const req = new NextRequest("http://localhost/api/par_favorito/USD_COP", {
      method: "PUT",
      headers: { authorization: "Bearer valido" },
      body: JSON.stringify({ base: "USD", destino: "COP" }),
    });
    const res = await putFavorito(req, { params: Promise.resolve({ id: "USD_COP" }) });
    expect(res.status).toBe(200);
  });
});
