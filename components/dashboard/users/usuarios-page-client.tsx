"use client";

import { useState } from "react";
import { UserPlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import UserForm from "./user-form";
import UsersTable from "./users-table";

export default function UsuariosPageClient() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => setRefreshKey((prev) => prev + 1);

  return (
    <div className="flex flex-col gap-4 max-w-7xl w-full p-4 md:p-8">
      <h1 className="text-2xl font-bold">Usuarios</h1>
      <div className="flex justify-end">
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              Agregar usuario
              <UserPlusIcon className="w-4 h-4 size-4 ml-2" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Agregar usuario</DialogTitle>
              <DialogDescription>
                Agregue un usuario administrador manualmente a la base de datos.
              </DialogDescription>
            </DialogHeader>
            <UserForm onSuccess={handleRefresh} />
          </DialogContent>
        </Dialog>
      </div>

      <UsersTable refreshKey={refreshKey} onRefresh={handleRefresh} />
    </div>
  );
}
