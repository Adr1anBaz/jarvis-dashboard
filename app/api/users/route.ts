import { NextRequest, NextResponse } from "next/server";
import { db } from "@/src/index";
import { usuario } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { sql } from "drizzle-orm"; // 👈 Importante para contar registros
import bcrypt from "bcryptjs";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  // ⚙️ Estos son los parámetros que se pueden ajustar fácilmente
  const page = parseInt(searchParams.get("page") || "1");
  const perPage = parseInt(searchParams.get("perPage") || "1"); // Limite de usuarios por pagina

  const offset = (page - 1) * perPage;

  // 🔄 Consulta paginada
  const users = await db.select().from(usuario).limit(perPage).offset(offset);

  // 🧮 Total de usuarios (opcional pero útil)
  const [{ count }] = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(usuario);

  return NextResponse.json({
    data: users,
    page,
    perPage,
    total: count,
    totalPages: Math.ceil(count / perPage),
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const hashedPassword = await bcrypt.hash(body.password, 10);
  try {
    // Check if the email already exists
    const existingUser = await db
      .select()
      .from(usuario)
      .where(eq(usuario.email, body.email))
      .limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: "El email ya está en uso" },
        { status: 400 }
      );
    }

    await db.insert(usuario).values({
      nombre: body.nombre,
      email: body.email,
      password: hashedPassword,
      rolId: body.rolId,
    });
    return NextResponse.json(
      { message: "Usuario creado correctamente" },
      { status: 201 }
    );
  } catch (e) {
    console.error("Error al crear el usuario:", e);
    return NextResponse.json(
      { error: "Error al crear el usuario" },
      { status: 500 }
    );
  }
}
