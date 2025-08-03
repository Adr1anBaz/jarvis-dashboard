import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { eq } from "drizzle-orm";
import { usuario } from "./db/schema";

const db = drizzle(process.env.DATABASE_URL!);

async function main() {
  const user: typeof usuario.$inferInsert = {
    nombre: "Jose",
    email: "jose@example.com",
    password: "123456",
  };

  await db.insert(usuario).values(user);
  console.log("New user created!");

  const users = await db.select().from(usuario);
  console.log("Getting all users from the database: ", users);
  /*
  const users: {
    id: number;
    name: string;
    age: number;
    email: string;
  }[]
  */

  await db
    .update(usuario)
    .set({
      nombre: "Jose",
    })
    .where(eq(usuario.email, user.email));
  console.log("User info updated!");
}

main();
