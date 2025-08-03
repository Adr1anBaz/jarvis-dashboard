import { NextResponse } from "next/server";
import { usuario } from "@/src/db/schema";
import { db } from "@/src/index";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { compare } from "bcrypt"; // TODO: Cambiar a bcryptjs
import { signJwt } from "@/lib/auth";

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
  const token = await signJwt({ id: user.id, email: user.email });

  (await cookies()).set("session", token, {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
  });

  return NextResponse.json({ message: "Inicio de sesión exitoso" });
}
