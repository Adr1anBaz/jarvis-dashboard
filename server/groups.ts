"use server";

import { db } from "@/src/index";
import { grupo, GrupoInsert } from "@/src/db/schema";

export async function createGroup(data: GrupoInsert) {
  try {
    const inserted = await db.insert(grupo).values(data).returning();
    return { ok: true, data: inserted[0] };
  } catch (error) {
    console.error(error);
    return { ok: false, error: "Error al crear el grupo" };
  }
}
