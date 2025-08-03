import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { eq } from "drizzle-orm";
import { usuario } from "./db/schema";

export const db = drizzle(process.env.DATABASE_URL!);
