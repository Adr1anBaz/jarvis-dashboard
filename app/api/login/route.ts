import { NextResponse } from "next/server";
import { usuario } from "@/src/db/schema";
import { db } from "@/src/index";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { compare } from "bcrypt"; // TODO: Cambiar a bcryptjs

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const result = await db
    .select()
    .from(usuario)
    .where(eq(usuario.email, email));
  const user = result[0];
  if (!user || user.password !== password) {
    return NextResponse.json(
      { error: "Credenciales inválidas" },
      { status: 401 }
    );
  }

  (await cookies()).set("session", user.id.toString(), {
    path: "/",
    httpOnly: true,
  });

  return NextResponse.json({ message: "Inicio de sesión exitoso" });
}
