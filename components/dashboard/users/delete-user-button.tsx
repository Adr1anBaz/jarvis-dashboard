"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Trash } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface DeleteUserButtonProps {
  userId: string;
  onSuccess?: () => void;
}

export default function DeleteUserButton({
  userId,
  onSuccess,
}: DeleteUserButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      });
      setIsLoading(false);
      toast.success("Usuario eliminado correctamente");
      setIsOpen(false);
      onSuccess?.();
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      toast.error("Error al eliminar usuario");
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Trash className="w-4 h-4 size-4 ml-2" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Eliminar Usuario</DialogTitle>
          <DialogDescription>
            Esta acción no se puede deshacer. Este usuario será eliminado
            permanentemente.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 size-4 ml-2" />
            ) : (
              "Eliminar Usuario"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
