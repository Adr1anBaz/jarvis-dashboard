import "dotenv/config"; // Asegura que las variables se carguen
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/drizzle/schema",
  out: "./src/drizzle/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!, // El `!` indica que estás seguro de que no es undefined
  },
  verbose: true,
  strict: true,
});
