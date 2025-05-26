"use client";

import { Button } from "@/components/ui/button"
import { Mail } from "lucide-react"
import UsuariosList from "@/components/usuarios-list"
import NovoUsuarioButton from "@/components/novo-usuario-button"
import { useState } from "react";

export default function UsuariosPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUsuarioCriadoInPage = () => {
    setRefreshKey(prevKey => prevKey + 1);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Usuários</h1>
          <p className="text-muted-foreground">Gerencie os usuários do sistema.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Enviar convite
          </Button>
          <NovoUsuarioButton onUsuarioCriado={handleUsuarioCriadoInPage} />
        </div>
      </div>

      <UsuariosList refreshKey={refreshKey} />
    </div>
  )
}
