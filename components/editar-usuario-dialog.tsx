"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Upload, User } from "lucide-react"
import { authService } from "../services/auth"

interface Usuario {
  id: number
  nome: string
  login: string
  email: string
  telefone?: string
  cargo?: string
  departamento?: string
  perfil?: string
  ativo: boolean
  avatar?: string
}

interface EditarUsuarioDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  usuario: Usuario
  onUsuarioAtualizado?: (usuario: Usuario) => void
}

export default function EditarUsuarioDialog({
  open,
  onOpenChange,
  usuario,
  onUsuarioAtualizado,
}: EditarUsuarioDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    cargo: "",
    departamento: "",
    status: "",
    perfil: "",
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (usuario) {
      setFormData({
        nome: usuario.nome || "",
        email: usuario.email || "",
        telefone: usuario.telefone || "",
        cargo: usuario.cargo || "",
        departamento: usuario.departamento || "",
        status: usuario.ativo ? "ativo" : "inativo",
        perfil: usuario.perfil || "USUARIO_PADRAO",
      })
      setAvatarPreview(usuario.avatar || null)
    }
  }, [usuario])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setAvatarPreview(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}
    if (!formData.nome.trim()) errors.nome = "Nome é obrigatório"
    if (!formData.email.trim()) {
      errors.email = "Email é obrigatório"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email inválido"
    }
    if (!formData.perfil) errors.perfil = "Perfil é obrigatório"
    if (!formData.status) errors.status = "Status é obrigatório"

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)
    const token = authService.getToken()

    if (!token) {
      setFormErrors({ api: "Usuário não autenticado. Faça login novamente." })
      setIsSubmitting(false)
      return
    }

    const payload = {
      nome: formData.nome,
      email: formData.email,
      telefone: formData.telefone,
      cargo: formData.cargo,
      departamento: formData.departamento,
      perfil: formData.perfil,
      ativo: formData.status === "ativo",
    }

    try {
      const response = await fetch(`http://localhost:8081/api/usuarios/${usuario.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        let errorMsg = "Erro ao atualizar usuário."
        try {
          const errorData = await response.json()
          errorMsg = errorData.message || errorMsg
        } catch {}
        setFormErrors({ api: errorMsg })
        setIsSubmitting(false)
        return
      }

      const dadosAtualizadosApi = await response.json()

      const usuarioAtualizadoParaCallback: Usuario = {
        id: dadosAtualizadosApi.id,
        nome: dadosAtualizadosApi.nome,
        login: dadosAtualizadosApi.login,
        email: dadosAtualizadosApi.email,
        telefone: dadosAtualizadosApi.telefone,
        cargo: dadosAtualizadosApi.cargo,
        departamento: dadosAtualizadosApi.departamento,
        perfil: dadosAtualizadosApi.perfil,
        ativo: dadosAtualizadosApi.ativo,
        avatar: avatarPreview || usuario.avatar,
      }

      if (onUsuarioAtualizado) {
        onUsuarioAtualizado(usuarioAtualizadoParaCallback)
      }
      onOpenChange(false)

    } catch (error: any) {
      setFormErrors({ api: error.message || "Erro de conexão ao atualizar usuário" })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getIniciais = (nome: string) => {
    if (!nome) return ""
    return nome
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Usuário</DialogTitle>
          <DialogDescription>Atualize os dados do usuário. Clique em salvar quando terminar.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="flex flex-col items-center mb-6">
            <div className="mb-4">
              <Avatar className="h-24 w-24">
                {avatarPreview ? (
                  <AvatarImage src={avatarPreview || "/placeholder.svg"} alt="Avatar preview" />
                ) : (
                  <AvatarFallback className="text-2xl bg-emerald-100 text-emerald-700">
                    {formData.nome ? getIniciais(formData.nome) : <User />}
                  </AvatarFallback>
                )}
              </Avatar>
            </div>
            <Label
              htmlFor="avatar-upload-edit"
              className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-9 px-4 py-2"
            >
              <Upload className="mr-2 h-4 w-4" />
              Carregar foto
            </Label>
            <Input id="avatar-upload-edit" type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome-edit">Nome completo</Label>
              <Input id="nome-edit" name="nome" placeholder="Digite o nome completo" value={formData.nome} onChange={handleChange} />
              {formErrors.nome && <p className="text-sm text-red-500">{formErrors.nome}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email-edit">Email</Label>
              <Input id="email-edit" name="email" type="email" placeholder="email@exemplo.com" value={formData.email} onChange={handleChange} />
              {formErrors.email && <p className="text-sm text-red-500">{formErrors.email}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="telefone-edit">Telefone</Label>
              <Input id="telefone-edit" name="telefone" placeholder="(00) 00000-0000" value={formData.telefone} onChange={handleChange} />
              {formErrors.telefone && <p className="text-sm text-red-500">{formErrors.telefone}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="cargo-edit">Cargo</Label>
              <Input id="cargo-edit" name="cargo" placeholder="Ex: Desenvolvedor, Gerente, etc." value={formData.cargo} onChange={handleChange} />
              {formErrors.cargo && <p className="text-sm text-red-500">{formErrors.cargo}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="departamento-edit">Departamento</Label>
              <Input id="departamento-edit" name="departamento" placeholder="Ex: Tecnologia, Marketing, etc." value={formData.departamento} onChange={handleChange} />
              {formErrors.departamento && <p className="text-sm text-red-500">{formErrors.departamento}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="perfil-edit">Perfil</Label>
              <Select name="perfil" value={formData.perfil} onValueChange={(value) => handleSelectChange("perfil", value)}>
                <SelectTrigger id="perfil-edit">
                  <SelectValue placeholder="Selecione o perfil" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMINISTRADOR">Administrador</SelectItem>
                  <SelectItem value="GESTOR">Gestor</SelectItem>
                  <SelectItem value="USUARIO_PADRAO">Usuário Padrão</SelectItem>
                </SelectContent>
              </Select>
              {formErrors.perfil && <p className="text-sm text-red-500">{formErrors.perfil}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status-edit">Status</Label>
              <Select name="status" value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                <SelectTrigger id="status-edit">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
              {formErrors.status && <p className="text-sm text-red-500">{formErrors.status}</p>}
            </div>
            <div />
          </div>

          {formErrors.api && <p className="mt-4 text-sm text-red-500">{formErrors.api}</p>}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
