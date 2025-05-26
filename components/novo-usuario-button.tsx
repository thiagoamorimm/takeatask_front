"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { UserPlus } from "lucide-react"
import CriarUsuarioDialog from "@/components/criar-usuario-dialog"
import { useRouter } from "next/navigation"

interface NovoUsuarioButtonProps {
  onUsuarioCriado?: () => void;
}

export default function NovoUsuarioButton({ onUsuarioCriado }: NovoUsuarioButtonProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const router = useRouter()

  const handleLocalUsuarioCriado = () => {
    // Atualizar a página após criar o usuário
    // router.refresh();
    if (onUsuarioCriado) {
      onUsuarioCriado();
    }
    setDialogOpen(false);
  }

  return (
    <>
      <Button className="flex items-center gap-2" onClick={() => setDialogOpen(true)}>
        <UserPlus className="h-4 w-4" />
        Novo Usuário
      </Button>

      <CriarUsuarioDialog open={dialogOpen} onOpenChange={setDialogOpen} onUsuarioCriado={handleLocalUsuarioCriado} />
    </>
  )
}
