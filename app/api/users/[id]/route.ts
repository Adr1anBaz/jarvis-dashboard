import { NextRequest, NextResponse } from "next/server";
import { db } from "@/src/index";
import { usuario } from "@/src/db/schema";
import { eq } from "drizzle-orm";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const id = parseInt(params.id);

  try {
    await db
      .update(usuario)
      .set({
        nombre: body.nombre,
        email: body.email,
        rolId: body.rolId,
      })
      .where(eq(usuario.id, id));

    return NextResponse.json({ message: "Usuario actualizado" });
  } catch (e) {
    console.error("Error al actualizar usuario:", e);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
