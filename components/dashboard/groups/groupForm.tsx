"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { createGroup } from "@/server/groups";
import { grupoTipo } from "@/src/db/schema";

import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  GRUPO_TIPO_VALUES,
  type GrupoTipo,
  type GrupoInsert,
} from "@/src/db/schema";

// usa tu tupla literal de valores
const schema = z.object({
  nombre: z.string().min(3, "Debe tener al menos 3 caracteres"),
  tipo: z.enum(GRUPO_TIPO_VALUES, { required_error: "Selecciona un tipo" }),
  parentId: z.number().int().nullable().optional(),
  universidadId: z.coerce.number().int(),
  requiereClave: z.boolean(),
  claveAcceso: z.string().nullable().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function GroupForm({ onSuccess }: { onSuccess?: () => void }) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      nombre: "",
      universidadId: 1,
      requiereClave: false,
      claveAcceso: null,
      parentId: null,
    },
    mode: "onSubmit",
  });

  const requiereClave = form.watch("requiereClave");

  const onSubmit = (values: FormValues) => {
    const payload: GrupoInsert = {
      nombre: values.nombre,
      tipo: values.tipo as GrupoTipo, // ya es del union correcto
      parentId: values.parentId ?? null,
      universidadId: 1, // int con z.coerce
      requiereClave: values.requiereClave,
      claveAcceso: values.requiereClave ? values.claveAcceso ?? null : null,
      fotoUrl: null,
      // createdAt/updatedAt vienen por default en DB
    };

    startTransition(async () => {
      try {
        const res = await createGroup(payload);
        if (res.ok) {
          toast.success("Grupo creado correctamente");
          form.reset();
          onSuccess?.();
        } else {
          toast.error(res.error ?? "Error al crear el grupo");
        }
      } catch (error: any) {
        toast.error(`Error al crear el grupo: ${error.message ?? error}`);
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Nombre */}
        <FormField
          control={form.control}
          name="nombre"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input
                  placeholder="Nombre del grupo"
                  {...field}
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Tipo */}
        <FormField
          control={form.control}
          name="tipo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo</FormLabel>
              <FormControl>
                <Select
                  value={field.value ?? undefined} // <- clave para placeholder
                  onValueChange={field.onChange}
                  disabled={isPending}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Elige el tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {GRUPO_TIPO_VALUES.filter((t) => t !== "universidad").map(
                      (t) => (
                        <SelectItem key={t} value={t}>
                          {t.charAt(0).toUpperCase() + t.slice(1)}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/** TODO: Agregar poder ligar con otras universidades para el futuro */}

        {/* Parent ID (opcional) */}
        <FormField
          control={form.control}
          name="parentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Parent ID (opcional)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="ID del grupo padre"
                  value={field.value ?? ""}
                  onChange={(e) => {
                    const v = e.target.value;
                    field.onChange(v === "" ? null : Number(v));
                  }}
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Requiere clave */}
        <FormField
          control={form.control}
          name="requiereClave"
          render={({ field }) => (
            <FormItem className="flex items-center gap-3">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(v) => field.onChange(v === true)}
                  disabled={isPending}
                />
              </FormControl>
              <FormLabel className="!mt-0">Requiere clave</FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Clave de Acceso */}
        <FormField
          control={form.control}
          name="claveAcceso"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Clave de acceso</FormLabel>
              <FormControl>
                <Input
                  placeholder="Clave (si aplica)"
                  value={field.value ?? ""}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value === "" ? null : e.target.value
                    )
                  }
                  disabled={isPending || !requiereClave}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending}>
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Guardar"}
        </Button>
      </form>
    </Form>
  );
}
