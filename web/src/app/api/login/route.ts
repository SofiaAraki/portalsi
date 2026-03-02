import { cookies } from "next/headers";

export async function POST(req: Request) {
  const body = await req.json();
  const response = await fetch(`${process.env.API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    return Response.json({ error: "Falha no login" }, { status: 401 });
  }

  const data = await response.json();
  const cookieStore = await cookies();

  cookieStore.set("token", data.token, {
    httpOnly: true,
    secure: true, 
    sameSite: "none", 
    path: "/",
    maxAge: 60 * 60 * 24 * 1,
  });

  return Response.json({ ok: true });
}