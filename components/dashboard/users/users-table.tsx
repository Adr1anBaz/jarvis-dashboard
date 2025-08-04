import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Usuario } from "@/src/db/schema";
import { getUsers } from "@/server/users";

export default async function UsersTable() {
  const users = await getUsers();
  return (
    <Table className="w-full table-auto">
      <TableCaption>Lista de usuarios</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[15%]">ID</TableHead>
          <TableHead className="w-[25%]">Nombre</TableHead>
          <TableHead className="w-[25%]">Email</TableHead>
          <TableHead className="w-[15%]">Rol</TableHead>
          <TableHead className="w-[20%]">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user: Usuario) => (
          <TableRow key={user.id}>
            <TableCell>{user.id}</TableCell>
            <TableCell>{user.nombre}</TableCell>
            <TableCell className="font-medium">{user.email}</TableCell>
            <TableCell>{user.rolId}</TableCell>
            <TableCell></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
