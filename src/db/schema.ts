import {
  pgTable,
  foreignKey,
  unique,
  serial,
  integer,
  timestamp,
  text,
  boolean,
  varchar,
  check,
  pgEnum,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const estadoReporte = pgEnum("estado_reporte", [
  "pendiente",
  "resuelto",
  "descartado",
]);
export const GRUPO_TIPO_VALUES = [
  "universidad",
  "carrera",
  "comunidad",
] as const;

export const grupoTipo = pgEnum("grupo_tipo", [...GRUPO_TIPO_VALUES]);

export type GrupoTipo = (typeof GRUPO_TIPO_VALUES)[number];

export const motivoReporte = pgEnum("motivo_reporte", [
  "spam",
  "acoso",
  "contenido_inadecuado",
  "falso",
  "otro",
]);
export const rolUsuarioGrupo = pgEnum("rol_usuario_grupo", [
  "administrador",
  "miembro",
]);
export const tipoContenidoOculto = pgEnum("tipo_contenido_oculto", [
  "aviso",
  "publicacion_foro",
  "respuesta_foro",
]);
export const tipoObjetivo = pgEnum("tipo_objetivo", [
  "respuesta_foro",
  "publicacion_foro",
  "aviso",
]);
export const tipoReaccion = pgEnum("tipo_reaccion", [
  "like",
  "no_apropiado",
  "no_me_interesa",
  "mas_informacion",
  "me_encanta",
  "me_divierte",
]);

export const usuarioGrupo = pgTable(
  "usuario_grupo",
  {
    id: serial().primaryKey().notNull(),
    usuarioId: integer("usuario_id"),
    grupoId: integer("grupo_id"),
    verificado: timestamp({ mode: "string" }),
    rol: rolUsuarioGrupo().default("miembro").notNull(),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    deletedAt: timestamp("deleted_at"),
  },
  (table) => [
    foreignKey({
      columns: [table.usuarioId],
      foreignColumns: [usuario.id],
      name: "usuario_grupo_usuario_id_fkey",
    }),
    foreignKey({
      columns: [table.grupoId],
      foreignColumns: [grupo.id],
      name: "usuario_grupo_grupo_id_fkey",
    }),
    unique("usuario_grupo_usuario_id_grupo_id_key").on(
      table.usuarioId,
      table.grupoId
    ),
  ]
);

export type UsuarioGrupo = typeof usuarioGrupo.$inferSelect;

export const grupo = pgTable(
  "grupo",
  {
    id: serial().primaryKey().notNull(),
    nombre: text().notNull(),
    tipo: grupoTipo(),
    parentId: integer("parent_id"),
    universidadId: integer("universidad_id"),
    requiereClave: boolean("requiere_clave").default(false),
    claveAcceso: text("clave_acceso"),
    fotoUrl: text("foto_url"),
    nivel: integer("nivel").default(0),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    deletedAt: timestamp("deleted_at"),
  },
  (table) => [
    foreignKey({
      columns: [table.parentId],
      foreignColumns: [table.id],
      name: "grupo_parent_id_fkey",
    }),
    foreignKey({
      columns: [table.universidadId],
      foreignColumns: [universidad.id],
      name: "grupo_universidad_id_fkey",
    }),
  ]
);

export type Grupo = typeof grupo.$inferSelect;
export type GrupoInsert = typeof grupo.$inferInsert;

export const universidad = pgTable("universidad", {
  id: serial().primaryKey().notNull(),
  nombre: text().notNull(),
  dominioEmail: text("dominio_email"),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  deletedAt: timestamp("deleted_at"),
});

export const roles = pgTable("roles", {
  id: serial().primaryKey().notNull(),
  rol: varchar({ length: 50 }).notNull(),
  descripcion: text().notNull(),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  deletedAt: timestamp("deleted_at"),
});

export const usuario = pgTable(
  "usuario",
  {
    id: serial().primaryKey().notNull(),
    nombre: text().notNull(),
    email: text().notNull(),
    password: text().notNull(),
    rolId: integer("rol_id"),
    verificado: boolean().default(false),
    fotoUrl: text("foto_url"),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    deletedAt: timestamp("deleted_at"),
  },
  (table) => [
    foreignKey({
      columns: [table.rolId],
      foreignColumns: [roles.id],
      name: "usuario_rol_id_fkey",
    }),
    unique("usuario_email_key").on(table.email),
  ]
);

export type Usuario = typeof usuario.$inferSelect;

export const correoAsociado = pgTable(
  "correo_asociado",
  {
    id: serial().primaryKey().notNull(),
    idUsuario: integer("id_usuario"),
    mail: text(),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    deletedAt: timestamp("deleted_at"),
  },
  (table) => [
    foreignKey({
      columns: [table.idUsuario],
      foreignColumns: [usuario.id],
      name: "correo_asociado_id_usuario_fkey",
    }),
  ]
);

export const aviso = pgTable(
  "aviso",
  {
    id: serial().primaryKey().notNull(),
    titulo: text().notNull(),
    contenido: text().notNull(),
    categoria: text(),
    fechaPublicacion: timestamp("fecha_publicacion", { mode: "string" }),
    fechaExpiracion: timestamp("fecha_expiracion", { mode: "string" }),
    esPublico: boolean("es_publico").default(false),
    grupoId: integer("grupo_id"),
    autorId: integer("autor_id"),
    archivoUrl: text("archivo_url"),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    deletedAt: timestamp("deleted_at"),
  },
  (table) => [
    foreignKey({
      columns: [table.grupoId],
      foreignColumns: [grupo.id],
      name: "aviso_grupo_id_fkey",
    }),
    foreignKey({
      columns: [table.autorId],
      foreignColumns: [usuario.id],
      name: "aviso_autor_id_fkey",
    }),
  ]
);

export const foro = pgTable(
  "foro",
  {
    id: serial().primaryKey().notNull(),
    grupoId: integer("grupo_id"),
    descripcion: text(),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    deletedAt: timestamp("deleted_at"),
  },
  (table) => [
    foreignKey({
      columns: [table.grupoId],
      foreignColumns: [grupo.id],
      name: "foro_grupo_id_fkey",
    }),
    unique("foro_grupo_id_key").on(table.grupoId),
  ]
);

export const respuestaForo = pgTable(
  "respuesta_foro",
  {
    id: serial().primaryKey().notNull(),
    publicacionForoId: integer("publicacion_foro_id"),
    contenido: text().notNull(),
    autorId: integer("autor_id"),
    fecha: timestamp({ mode: "string" }).default(sql`CURRENT_TIMESTAMP`),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    deletedAt: timestamp("deleted_at"),
  },
  (table) => [
    foreignKey({
      columns: [table.publicacionForoId],
      foreignColumns: [publicacionForo.id],
      name: "respuesta_foro_publicacion_foro_id_fkey",
    }),
    foreignKey({
      columns: [table.autorId],
      foreignColumns: [usuario.id],
      name: "respuesta_foro_autor_id_fkey",
    }),
  ]
);

export const publicacionForo = pgTable(
  "publicacion_foro",
  {
    id: serial().primaryKey().notNull(),
    foroId: integer("foro_id"),
    titulo: text(),
    contenido: text().notNull(),
    categoria: text(),
    archivoUrl: text("archivo_url"),
    autorId: integer("autor_id"),
    fecha: timestamp({ mode: "string" }).default(sql`CURRENT_TIMESTAMP`),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    deletedAt: timestamp("deleted_at"),
  },
  (table) => [
    foreignKey({
      columns: [table.foroId],
      foreignColumns: [foro.id],
      name: "publicacion_foro_foro_id_fkey",
    }),
    foreignKey({
      columns: [table.autorId],
      foreignColumns: [usuario.id],
      name: "publicacion_foro_autor_id_fkey",
    }),
  ]
);

export const reaccion = pgTable(
  "reaccion",
  {
    id: serial().primaryKey().notNull(),
    tipo: tipoReaccion().notNull(),
    usuarioId: integer("usuario_id"),
    avisoId: integer("aviso_id"),
    publicacionForoId: integer("publicacion_foro_id"),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    deletedAt: timestamp("deleted_at"),
  },
  (table) => [
    foreignKey({
      columns: [table.usuarioId],
      foreignColumns: [usuario.id],
      name: "reaccion_usuario_id_fkey",
    }),
    foreignKey({
      columns: [table.avisoId],
      foreignColumns: [aviso.id],
      name: "reaccion_aviso_id_fkey",
    }),
    foreignKey({
      columns: [table.publicacionForoId],
      foreignColumns: [publicacionForo.id],
      name: "reaccion_publicacion_foro_id_fkey",
    }),
    unique("reaccion_usuario_id_tipo_aviso_id_publicacion_foro_id_key").on(
      table.tipo,
      table.usuarioId,
      table.avisoId,
      table.publicacionForoId
    ),
  ]
);

export const reporte = pgTable(
  "reporte",
  {
    id: serial().primaryKey().notNull(),
    usuarioId: integer("usuario_id").notNull(),
    objetivoId: integer("objetivo_id").notNull(),
    tipoObjetivo: tipoObjetivo("tipo_objetivo").notNull(),
    descripcion: text().notNull(),
    motivo: motivoReporte().notNull(),
    fechaReporte: timestamp("fecha_reporte", { mode: "string" }).default(
      sql`CURRENT_TIMESTAMP`
    ),
    estado: estadoReporte().default("pendiente"),
    moderadorId: integer("moderador_id"),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    deletedAt: timestamp("deleted_at"),
  },
  (table) => [
    foreignKey({
      columns: [table.usuarioId],
      foreignColumns: [usuario.id],
      name: "reporte_usuario_id_fkey",
    }),
    foreignKey({
      columns: [table.moderadorId],
      foreignColumns: [usuario.id],
      name: "reporte_moderador_id_fkey",
    }),
  ]
);

export const usuarioBloqueado = pgTable(
  "usuario_bloqueado",
  {
    id: serial().primaryKey().notNull(),
    bloqueadorId: integer("bloqueador_id"),
    bloqueadoId: integer("bloqueado_id"),
    fechaBloqueo: timestamp("fecha_bloqueo", { mode: "string" }).default(
      sql`CURRENT_TIMESTAMP`
    ),
    razon: text(),
    activo: boolean().default(true),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    deletedAt: timestamp("deleted_at"),
  },
  (table) => [
    foreignKey({
      columns: [table.bloqueadorId],
      foreignColumns: [usuario.id],
      name: "usuario_bloqueado_bloqueador_id_fkey",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.bloqueadoId],
      foreignColumns: [usuario.id],
      name: "usuario_bloqueado_bloqueado_id_fkey",
    }).onDelete("cascade"),
    unique("usuario_bloqueado_bloqueador_id_bloqueado_id_key").on(
      table.bloqueadorId,
      table.bloqueadoId
    ),
    check("usuario_bloqueado_check", sql`bloqueador_id <> bloqueado_id`),
  ]
);

export const contenidoOculto = pgTable(
  "contenido_oculto",
  {
    id: serial().primaryKey().notNull(),
    usuarioId: integer("usuario_id"),
    objectId: integer("object_id").notNull(),
    objectType: tipoContenidoOculto("object_type").notNull(),
    fechaOcultado: timestamp("fecha_ocultado", { mode: "string" }).default(
      sql`CURRENT_TIMESTAMP`
    ),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    deletedAt: timestamp("deleted_at"),
  },
  (table) => [
    foreignKey({
      columns: [table.usuarioId],
      foreignColumns: [usuario.id],
      name: "contenido_oculto_usuario_id_fkey",
    }).onDelete("cascade"),
    unique("contenido_oculto_usuario_id_object_type_object_id_key").on(
      table.usuarioId,
      table.objectId,
      table.objectType
    ),
  ]
);

export const drizzleMigrations = pgTable("_drizzle_migrations", {
  id: serial().primaryKey().notNull(),
  hash: text().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
});
