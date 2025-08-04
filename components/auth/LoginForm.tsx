"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";

// Definición del esquema de validación para el formulario de login.
// email: debe ser un correo electrónico válido.
// password: debe tener al menos 6 caracteres.
const loginSchema = z.object({
  email: z.string().email({ message: "Correo inválido" }),
  password: z
    .string()
    .min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
});

// Definición del tipo de datos que se van a manejar en el formulario.
// Se obtiene a partir del esquema de validación.
type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  // Inicialización del formulario con los valores por defecto y el esquema de validación.
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Función que se ejecuta cuando el usuario hace click en el botón de login.
  // Hace una petición POST con el email y password al backend (api/login).
  // Si la respuesta es exitosa, redirige al usuario a la página de dashboard.
  // Si la respuesta es un error, muestra un mensaje de error.
  const onSubmit = async (data: LoginFormData) => {
    const res = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (res.ok) {
      window.location.href = "/dashboard";
    } else {
      toast.error("Error al iniciar sesión. Credenciales inválidas");
    }
  };

  return (
    <div className="max-w-sm w-full bg-white p-8 rounded shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-center text-foreground">
        Iniciar sesión
      </h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Correo electrónico</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Correo electrónico"
                    className="text-gray-800 bg-white rounded-md p-2"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Contraseña</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Contraseña"
                    type="password"
                    className="text-gray-800 bg-white rounded-md p-2"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full bg-white text-black-600 py-2 rounded hover:bg-gray-200 transition"
          >
            {form.formState.isSubmitting ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              "Iniciar sesión"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
