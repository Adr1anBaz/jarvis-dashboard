import { relations } from "drizzle-orm/relations";
import { usuario, usuarioGrupo, grupo, universidad, roles, correoAsociado, aviso, foro, publicacionForo, respuestaForo, reaccion, reporte, usuarioBloqueado, contenidoOculto } from "./schema";

export const usuarioGrupoRelations = relations(usuarioGrupo, ({one}) => ({
	usuario: one(usuario, {
		fields: [usuarioGrupo.usuarioId],
		references: [usuario.id]
	}),
	grupo: one(grupo, {
		fields: [usuarioGrupo.grupoId],
		references: [grupo.id]
	}),
}));

export const usuarioRelations = relations(usuario, ({one, many}) => ({
	usuarioGrupos: many(usuarioGrupo),
	role: one(roles, {
		fields: [usuario.rolId],
		references: [roles.id]
	}),
	correoAsociados: many(correoAsociado),
	avisos: many(aviso),
	respuestaForos: many(respuestaForo),
	publicacionForos: many(publicacionForo),
	reaccions: many(reaccion),
	reportes_usuarioId: many(reporte, {
		relationName: "reporte_usuarioId_usuario_id"
	}),
	reportes_moderadorId: many(reporte, {
		relationName: "reporte_moderadorId_usuario_id"
	}),
	usuarioBloqueados_bloqueadorId: many(usuarioBloqueado, {
		relationName: "usuarioBloqueado_bloqueadorId_usuario_id"
	}),
	usuarioBloqueados_bloqueadoId: many(usuarioBloqueado, {
		relationName: "usuarioBloqueado_bloqueadoId_usuario_id"
	}),
	contenidoOcultos: many(contenidoOculto),
}));

export const grupoRelations = relations(grupo, ({one, many}) => ({
	usuarioGrupos: many(usuarioGrupo),
	grupo: one(grupo, {
		fields: [grupo.parentId],
		references: [grupo.id],
		relationName: "grupo_parentId_grupo_id"
	}),
	grupos: many(grupo, {
		relationName: "grupo_parentId_grupo_id"
	}),
	universidad: one(universidad, {
		fields: [grupo.universidadId],
		references: [universidad.id]
	}),
	avisos: many(aviso),
	foros: many(foro),
}));

export const universidadRelations = relations(universidad, ({many}) => ({
	grupos: many(grupo),
}));

export const rolesRelations = relations(roles, ({many}) => ({
	usuarios: many(usuario),
}));

export const correoAsociadoRelations = relations(correoAsociado, ({one}) => ({
	usuario: one(usuario, {
		fields: [correoAsociado.idUsuario],
		references: [usuario.id]
	}),
}));

export const avisoRelations = relations(aviso, ({one, many}) => ({
	grupo: one(grupo, {
		fields: [aviso.grupoId],
		references: [grupo.id]
	}),
	usuario: one(usuario, {
		fields: [aviso.autorId],
		references: [usuario.id]
	}),
	reaccions: many(reaccion),
}));

export const foroRelations = relations(foro, ({one, many}) => ({
	grupo: one(grupo, {
		fields: [foro.grupoId],
		references: [grupo.id]
	}),
	publicacionForos: many(publicacionForo),
}));

export const respuestaForoRelations = relations(respuestaForo, ({one}) => ({
	publicacionForo: one(publicacionForo, {
		fields: [respuestaForo.publicacionForoId],
		references: [publicacionForo.id]
	}),
	usuario: one(usuario, {
		fields: [respuestaForo.autorId],
		references: [usuario.id]
	}),
}));

export const publicacionForoRelations = relations(publicacionForo, ({one, many}) => ({
	respuestaForos: many(respuestaForo),
	foro: one(foro, {
		fields: [publicacionForo.foroId],
		references: [foro.id]
	}),
	usuario: one(usuario, {
		fields: [publicacionForo.autorId],
		references: [usuario.id]
	}),
	reaccions: many(reaccion),
}));

export const reaccionRelations = relations(reaccion, ({one}) => ({
	usuario: one(usuario, {
		fields: [reaccion.usuarioId],
		references: [usuario.id]
	}),
	aviso: one(aviso, {
		fields: [reaccion.avisoId],
		references: [aviso.id]
	}),
	publicacionForo: one(publicacionForo, {
		fields: [reaccion.publicacionForoId],
		references: [publicacionForo.id]
	}),
}));

export const reporteRelations = relations(reporte, ({one}) => ({
	usuario_usuarioId: one(usuario, {
		fields: [reporte.usuarioId],
		references: [usuario.id],
		relationName: "reporte_usuarioId_usuario_id"
	}),
	usuario_moderadorId: one(usuario, {
		fields: [reporte.moderadorId],
		references: [usuario.id],
		relationName: "reporte_moderadorId_usuario_id"
	}),
}));

export const usuarioBloqueadoRelations = relations(usuarioBloqueado, ({one}) => ({
	usuario_bloqueadorId: one(usuario, {
		fields: [usuarioBloqueado.bloqueadorId],
		references: [usuario.id],
		relationName: "usuarioBloqueado_bloqueadorId_usuario_id"
	}),
	usuario_bloqueadoId: one(usuario, {
		fields: [usuarioBloqueado.bloqueadoId],
		references: [usuario.id],
		relationName: "usuarioBloqueado_bloqueadoId_usuario_id"
	}),
}));

export const contenidoOcultoRelations = relations(contenidoOculto, ({one}) => ({
	usuario: one(usuario, {
		fields: [contenidoOculto.usuarioId],
		references: [usuario.id]
	}),
}));