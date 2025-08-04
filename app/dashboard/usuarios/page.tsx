import { Button } from "@/components/ui/button";
import UsersTable from "@/components/dashboard/users/users-table";
import { UserPlusIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import UserForm from "@/components/dashboard/users/user-form";
import { getUsers } from "@/server/users";

export default async function Home() {
  const users = await getUsers();
  // TODO SACAR LOS USUARIOS CON FETCH NO CON USERS.TS de server
  return (
    <div className="flex flex-col gap-4  max-w-7xl w-full p-4 md:p-8">
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
            <div className="flex flex-col gap-4">
              <UserForm />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <UsersTable />
    </div>
  );
}
