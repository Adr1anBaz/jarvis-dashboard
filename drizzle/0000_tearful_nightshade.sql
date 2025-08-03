-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations

CREATE TYPE "public"."estado_reporte" AS ENUM('pendiente', 'resuelto', 'descartado');--> statement-breakpoint
CREATE TYPE "public"."grupo_tipo" AS ENUM('universidad', 'carrera', 'comunidad');--> statement-breakpoint
CREATE TYPE "public"."motivo_reporte" AS ENUM('spam', 'acoso', 'contenido_inadecuado', 'falso', 'otro');--> statement-breakpoint
CREATE TYPE "public"."rol_usuario_grupo" AS ENUM('administrador', 'miembro');--> statement-breakpoint
CREATE TYPE "public"."tipo_contenido_oculto" AS ENUM('aviso', 'publicacion_foro', 'respuesta_foro');--> statement-breakpoint
CREATE TYPE "public"."tipo_objetivo" AS ENUM('respuesta_foro', 'publicacion_foro', 'aviso');--> statement-breakpoint
CREATE TYPE "public"."tipo_reaccion" AS ENUM('like', 'no_apropiado', 'no_me_interesa', 'mas_informacion', 'me_encanta', 'me_divierte');--> statement-breakpoint
CREATE TABLE "usuario_grupo" (
	"id" serial PRIMARY KEY NOT NULL,
	"usuario_id" integer,
	"grupo_id" integer,
	"verificado" timestamp,
	"rol" "rol_usuario_grupo" DEFAULT 'miembro' NOT NULL,
	CONSTRAINT "usuario_grupo_usuario_id_grupo_id_key" UNIQUE("usuario_id","grupo_id")
);
--> statement-breakpoint
CREATE TABLE "grupo" (
	"id" serial PRIMARY KEY NOT NULL,
	"nombre" text NOT NULL,
	"tipo" "grupo_tipo",
	"parent_id" integer,
	"universidad_id" integer,
	"requiere_clave" boolean DEFAULT false,
	"clave_acceso" text,
	"foto_url" text
);
--> statement-breakpoint
CREATE TABLE "universidad" (
	"id" serial PRIMARY KEY NOT NULL,
	"nombre" text NOT NULL,
	"dominio_email" text
);
--> statement-breakpoint
CREATE TABLE "roles" (
	"id" serial PRIMARY KEY NOT NULL,
	"rol" varchar(50) NOT NULL,
	"descripcion" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "usuario" (
	"id" serial PRIMARY KEY NOT NULL,
	"nombre" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"rol_id" integer,
	"verificado" boolean DEFAULT false,
	"foto_url" text,
	CONSTRAINT "usuario_email_key" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "correo_asociado" (
	"id" serial PRIMARY KEY NOT NULL,
	"id_usuario" integer,
	"mail" text
);
--> statement-breakpoint
CREATE TABLE "aviso" (
	"id" serial PRIMARY KEY NOT NULL,
	"titulo" text NOT NULL,
	"contenido" text NOT NULL,
	"categoria" text,
	"fecha_publicacion" timestamp,
	"fecha_expiracion" timestamp,
	"es_publico" boolean DEFAULT false,
	"grupo_id" integer,
	"autor_id" integer,
	"archivo_url" text
);
--> statement-breakpoint
CREATE TABLE "foro" (
	"id" serial PRIMARY KEY NOT NULL,
	"grupo_id" integer,
	"descripcion" text,
	CONSTRAINT "foro_grupo_id_key" UNIQUE("grupo_id")
);
--> statement-breakpoint
CREATE TABLE "respuesta_foro" (
	"id" serial PRIMARY KEY NOT NULL,
	"publicacion_foro_id" integer,
	"contenido" text NOT NULL,
	"autor_id" integer,
	"fecha" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE "publicacion_foro" (
	"id" serial PRIMARY KEY NOT NULL,
	"foro_id" integer,
	"titulo" text,
	"contenido" text NOT NULL,
	"categoria" text,
	"archivo_url" text,
	"autor_id" integer,
	"fecha" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE "reaccion" (
	"id" serial PRIMARY KEY NOT NULL,
	"tipo" "tipo_reaccion" NOT NULL,
	"usuario_id" integer,
	"aviso_id" integer,
	"publicacion_foro_id" integer,
	CONSTRAINT "reaccion_usuario_id_tipo_aviso_id_publicacion_foro_id_key" UNIQUE("tipo","usuario_id","aviso_id","publicacion_foro_id")
);
--> statement-breakpoint
CREATE TABLE "reporte" (
	"id" serial PRIMARY KEY NOT NULL,
	"usuario_id" integer NOT NULL,
	"objetivo_id" integer NOT NULL,
	"tipo_objetivo" "tipo_objetivo" NOT NULL,
	"descripcion" text NOT NULL,
	"motivo" "motivo_reporte" NOT NULL,
	"fecha_reporte" timestamp DEFAULT CURRENT_TIMESTAMP,
	"estado" "estado_reporte" DEFAULT 'pendiente',
	"moderador_id" integer
);
--> statement-breakpoint
CREATE TABLE "usuario_bloqueado" (
	"id" serial PRIMARY KEY NOT NULL,
	"bloqueador_id" integer,
	"bloqueado_id" integer,
	"fecha_bloqueo" timestamp DEFAULT CURRENT_TIMESTAMP,
	"razon" text,
	"activo" boolean DEFAULT true,
	CONSTRAINT "usuario_bloqueado_bloqueador_id_bloqueado_id_key" UNIQUE("bloqueador_id","bloqueado_id"),
	CONSTRAINT "usuario_bloqueado_check" CHECK (bloqueador_id <> bloqueado_id)
);
--> statement-breakpoint
CREATE TABLE "contenido_oculto" (
	"id" serial PRIMARY KEY NOT NULL,
	"usuario_id" integer,
	"object_id" integer NOT NULL,
	"object_type" "tipo_contenido_oculto" NOT NULL,
	"fecha_ocultado" timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "contenido_oculto_usuario_id_object_type_object_id_key" UNIQUE("usuario_id","object_id","object_type")
);
--> statement-breakpoint
CREATE TABLE "_drizzle_migrations" (
	"id" serial PRIMARY KEY NOT NULL,
	"hash" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "usuario_grupo" ADD CONSTRAINT "usuario_grupo_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuario"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "usuario_grupo" ADD CONSTRAINT "usuario_grupo_grupo_id_fkey" FOREIGN KEY ("grupo_id") REFERENCES "public"."grupo"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "grupo" ADD CONSTRAINT "grupo_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "public"."grupo"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "grupo" ADD CONSTRAINT "grupo_universidad_id_fkey" FOREIGN KEY ("universidad_id") REFERENCES "public"."universidad"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "usuario" ADD CONSTRAINT "usuario_rol_id_fkey" FOREIGN KEY ("rol_id") REFERENCES "public"."roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "correo_asociado" ADD CONSTRAINT "correo_asociado_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "public"."usuario"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "aviso" ADD CONSTRAINT "aviso_grupo_id_fkey" FOREIGN KEY ("grupo_id") REFERENCES "public"."grupo"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "aviso" ADD CONSTRAINT "aviso_autor_id_fkey" FOREIGN KEY ("autor_id") REFERENCES "public"."usuario"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "foro" ADD CONSTRAINT "foro_grupo_id_fkey" FOREIGN KEY ("grupo_id") REFERENCES "public"."grupo"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "respuesta_foro" ADD CONSTRAINT "respuesta_foro_publicacion_foro_id_fkey" FOREIGN KEY ("publicacion_foro_id") REFERENCES "public"."publicacion_foro"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "respuesta_foro" ADD CONSTRAINT "respuesta_foro_autor_id_fkey" FOREIGN KEY ("autor_id") REFERENCES "public"."usuario"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "publicacion_foro" ADD CONSTRAINT "publicacion_foro_foro_id_fkey" FOREIGN KEY ("foro_id") REFERENCES "public"."foro"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "publicacion_foro" ADD CONSTRAINT "publicacion_foro_autor_id_fkey" FOREIGN KEY ("autor_id") REFERENCES "public"."usuario"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reaccion" ADD CONSTRAINT "reaccion_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuario"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reaccion" ADD CONSTRAINT "reaccion_aviso_id_fkey" FOREIGN KEY ("aviso_id") REFERENCES "public"."aviso"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reaccion" ADD CONSTRAINT "reaccion_publicacion_foro_id_fkey" FOREIGN KEY ("publicacion_foro_id") REFERENCES "public"."publicacion_foro"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reporte" ADD CONSTRAINT "reporte_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuario"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reporte" ADD CONSTRAINT "reporte_moderador_id_fkey" FOREIGN KEY ("moderador_id") REFERENCES "public"."usuario"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "usuario_bloqueado" ADD CONSTRAINT "usuario_bloqueado_bloqueador_id_fkey" FOREIGN KEY ("bloqueador_id") REFERENCES "public"."usuario"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "usuario_bloqueado" ADD CONSTRAINT "usuario_bloqueado_bloqueado_id_fkey" FOREIGN KEY ("bloqueado_id") REFERENCES "public"."usuario"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contenido_oculto" ADD CONSTRAINT "contenido_oculto_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuario"("id") ON DELETE cascade ON UPDATE no action;
