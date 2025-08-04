// This file is used to manage the users in the database.

import { db } from "@/src/index";
import { usuario } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { Usuario } from "@/src/db/schema";

export async function getUsers() {
  try {
    const users = await db.select().from(usuario);
    return users;
  } catch (error) {
    console.error("Error al obtener los usuarios:", error);
    throw new Error("Error al obtener los usuarios");
  }
}
