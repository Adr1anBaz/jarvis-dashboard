import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { redirect } from "next/navigation";

export async function POST() {
  (await cookies()).delete("session");
  redirect("/login");
  return NextResponse.json({ message: "Cierre de sesión exitoso" });
}
