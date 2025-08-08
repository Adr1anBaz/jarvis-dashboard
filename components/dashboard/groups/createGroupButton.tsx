"use client";

import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import GroupForm from "./groupForm";

export default function CreateGroupButton({
  onSuccess,
}: {
  onSuccess?: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSuccess = () => {
    // 1. Cierra el modal
    setIsOpen(false);

    // 2. Llama al padre
    onSuccess?.();
  };

  return (
    <div className="flex justify-end">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button>
            Agregar grupo
            <PlusCircle className="w-4 h-4 size-4 ml-2" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar grupo</DialogTitle>
            <DialogDescription>
              Crear un nuevo grupo dentro de la jerarquía.
            </DialogDescription>
          </DialogHeader>

          {/* ✅ El formulario avisa que fue exitoso */}
          <GroupForm onSuccess={handleSuccess} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
