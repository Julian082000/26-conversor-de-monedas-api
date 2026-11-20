export default function HomePage() {
  return (
    <main style={{ fontFamily: "system-ui, sans-serif", maxWidth: 640, margin: "60px auto", padding: "0 20px", lineHeight: 1.6 }}>
      <h1>API REST — Conversor de Monedas Offline-First</h1>
      <p style={{ color: "#16a34a", fontWeight: 600 }}>● Servicio en línea y operativo en Vercel</p>
      <p>Backend serverless en Next.js + TypeScript con autenticación JWT de Firebase y persistencia en Cloud Firestore.</p>
      <h2>Endpoints disponibles</h2>
      <ul>
        <li><code>POST /api/auth/registro</code> — Registro de usuario</li>
        <li><code>POST /api/auth/login</code> — Inicio de sesión</li>
        <li><code>GET /api/auth/yo</code> — Perfil autenticado</li>
        <li><code>GET /api/tasas</code> — Tasas de cambio en tiempo real</li>
        <li><code>GET /api/tasas/historial</code> — Historial de 7 días</li>
        <li><code>GET / POST / DELETE /api/par_favorito</code> — Sincronización LWW de pares favoritos</li>
      </ul>
    </main>
  );
}