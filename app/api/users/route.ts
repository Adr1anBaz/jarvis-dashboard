import { NextRequest, NextResponse } from "next/server";
import { db } from "@/src/index";
import { usuario } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

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
