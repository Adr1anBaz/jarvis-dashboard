"use client";
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
import UserForm from "./user-form";
import { Pencil } from "lucide-react";
import DeleteUserButton from "./delete-user-button";
import { useEffect, useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function UsersTable({
  refreshKey = 0,
  onRefresh,
}: {
  refreshKey: number;
  onRefresh: () => void;
}) {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const perPage = 10;
  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch(
        `/api/users?page=${page}&perPage=${perPage}`
      );
      const json = await response.json();
      setUsers(json.data);
      setTotalPages(json.totalPages);
    };
    fetchUsers();
  }, [page, refreshKey]);

  const handlePageChange = (page: number) => {
    setPage(page);
  };

  return (
    <div>
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
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Pencil className="w-4 h-4 size-4 ml-2" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Editar Usuario</DialogTitle>
                    </DialogHeader>
                    <UserForm user={user} onSuccess={onRefresh} />
                  </DialogContent>
                </Dialog>
                <DeleteUserButton
                  userId={user.id.toString()}
                  onSuccess={onRefresh}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (page > 1) {
                  handlePageChange(page - 1);
                }
              }}
              className={`${
                page === 1 ? "opacity-50 pointer-events-none" : ""
              }`}
              aria-disabled={page === 1}
            />
          </PaginationItem>
          {Array.from({ length: totalPages }, (_, index) => (
            <PaginationItem key={index}>
              <PaginationLink
                href="#"
                isActive={page === index + 1}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (page < totalPages) {
                  handlePageChange(page + 1);
                }
              }}
              className={`${
                page === totalPages ? "opacity-50 pointer-events-none" : ""
              }`}
              aria-disabled={page === totalPages}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
