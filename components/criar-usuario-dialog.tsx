"use client"

import type React from "react"

import { useState } from "react"
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

interface CriarUsuarioDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onUsuarioCriado?: () => void
}

export default function CriarUsuarioDialog({ open, onOpenChange, onUsuarioCriado }: CriarUsuarioDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  interface FormData {
    nome: string;
    email: string;
    telefone: string;
    cargo: string;
    departamento: string;
    status: string;
    senha?: string;
    confirmarSenha?: string;
    perfil: string;
  }

  const [formData, setFormData] = useState<FormData>({
    nome: "",
    email: "",
    telefone: "",
    cargo: "",
    departamento: "",
    status: "ativo",
    senha: undefined,
    confirmarSenha: undefined,
    perfil: "USUARIO_PADRAO"
  })

  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Limpar erro quando o usuário começa a digitar
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

    if (!formData.nome.trim()) {
      errors.nome = "Nome é obrigatório"
    }

    if (!formData.email.trim()) {
      errors.email = "Email é obrigatório"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email inválido"
    }

    if (!formData.telefone.trim()) {
      errors.telefone = "Telefone é obrigatório"
    }

    if (!formData.cargo.trim()) {
      errors.cargo = "Cargo é obrigatório"
    }

    if (!formData.departamento.trim()) {
      errors.departamento = "Departamento é obrigatório"
    }

    if (!formData.perfil) {
      errors.perfil = "Perfil é obrigatório"
    }

    // Senha validation - Restaurando lógica original
    if (!formData.senha) { // Esta condição trata undefined e string vazia
      errors.senha = "Senha é obrigatória"
    } else if (formData.senha.length < 6) {
      errors.senha = "A senha deve ter pelo menos 6 caracteres"
    }

    // Confirmar Senha validation - Restaurando lógica original
    // A confirmação só é relevante se a senha foi digitada. 
    // E se a senha foi digitada, a confirmação não pode ser diferente.
    // Se a senha não foi digitada (e.g. undefined ou ""), não faz sentido validar a confirmação ainda.
    // A obrigatoriedade da confirmação é implícita à da senha.
    if (formData.senha && formData.senha !== formData.confirmarSenha) { 
      // Se senha existe mas é diferente da confirmação (que pode ser undefined, "" ou diferente)
      // Ou se ambas existem e são diferentes.
      // Se confirmarSenha for undefined/"" e senha não, elas serão diferentes.
      errors.confirmarSenha = "As senhas não coincidem"
    } else if (formData.senha && !formData.confirmarSenha) {
      // Caso específico: senha preenchida, confirmação vazia (undefined ou "")
      errors.confirmarSenha = "Confirmação de senha é obrigatória"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const resetForm = () => {
    setFormData({
      nome: "",
      email: "",
      telefone: "",
      cargo: "",
      departamento: "",
      status: "ativo",
      senha: undefined,
      confirmarSenha: undefined,
      perfil: "USUARIO_PADRAO", // valor padrão

    })
    setAvatarPreview(null)
    setFormErrors({})
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    const token = authService.getToken()
    if (!token) {
      setFormErrors({ api: "Usuário não autenticado. Faça login novamente." })
      setIsSubmitting(false)
      return
    }

    try {
      const response = await fetch("http://localhost:8081/api/usuarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          nome: formData.nome,
          login: formData.email,
          senha: formData.senha,
          perfil: formData.perfil,
          telefone: formData.telefone,
          cargo: formData.cargo,
          departamento: formData.departamento,
          status: formData.status
        }),
      })

      if (!response.ok) {
        let errorMsg = "Erro ao criar usuário."
        try {
          const errorData = await response.json()
          errorMsg = errorData.message || errorMsg
        } catch {}
        setFormErrors({ api: errorMsg })
        return
      }

      onOpenChange(false)
      resetForm()

      if (onUsuarioCriado) {
        onUsuarioCriado()
      }
    } catch (error: any) {
      setFormErrors({ api: error.message || "Erro ao criar usuário" })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Gerar iniciais a partir do nome
  const getIniciais = (nome: string) => {
    return nome
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        if (!newOpen) {
          resetForm()
        }
        onOpenChange(newOpen)
      }}
    >
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo Usuário</DialogTitle>
          <DialogDescription>
            Preencha os dados abaixo para criar um novo usuário no sistema.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome Completo</Label>
              <Input id="nome" name="nome" value={formData.nome} onChange={handleChange} placeholder="Ex: João da Silva" />
              {formErrors.nome && <p className="text-sm text-red-500">{formErrors.nome}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Ex: joao.silva@example.com" />
              {formErrors.email && <p className="text-sm text-red-500">{formErrors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone</Label>
              <Input id="telefone" name="telefone" value={formData.telefone} onChange={handleChange} placeholder="Ex: (21) 99999-9999" />
              {formErrors.telefone && <p className="text-sm text-red-500">{formErrors.telefone}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cargo">Cargo</Label>
              <Input id="cargo" name="cargo" value={formData.cargo} onChange={handleChange} placeholder="Ex: Desenvolvedor Frontend" />
              {formErrors.cargo && <p className="text-sm text-red-500">{formErrors.cargo}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="departamento">Departamento</Label>
              <Input id="departamento" name="departamento" value={formData.departamento} onChange={handleChange} placeholder="Ex: Tecnologia" />
              {formErrors.departamento && <p className="text-sm text-red-500">{formErrors.departamento}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="perfil">Perfil</Label>
              <Select value={formData.perfil} onValueChange={(value) => handleSelectChange("perfil", value)}>
                <SelectTrigger id="perfil">
                  <SelectValue placeholder="Selecione o perfil" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USUARIO_PADRAO">Usuário Padrão</SelectItem>
                  <SelectItem value="ADMINISTRADOR_GESTOR">Administrador</SelectItem>
                </SelectContent>
              </Select>
              {formErrors.perfil && <p className="text-sm text-red-500">{formErrors.perfil}</p>}
            </div>

            <div className="space-y-1">
              <Label htmlFor="senha">Senha</Label>
              <Input
                id="senha"
                name="senha"
                type="password"
                placeholder="Digite a senha"
                value={formData.senha || ""}
                onChange={handleChange}
                className={formErrors.senha ? "border-red-500" : ""}
              />
              {formErrors.senha && <p className="text-xs text-red-500">{formErrors.senha}</p>}
            </div>

            <div className="space-y-1">
              <Label htmlFor="confirmarSenha">Confirmar senha</Label>
              <Input
                id="confirmarSenha"
                name="confirmarSenha"
                type="password"
                placeholder="Confirme a senha"
                value={formData.confirmarSenha || ""}
                onChange={handleChange}
                className={formErrors.confirmarSenha ? "border-red-500" : ""}
              />
              {formErrors.confirmarSenha && (
                <p className="text-xs text-red-500">{formErrors.confirmarSenha}</p>
              )}
            </div>
          </div>

          {formErrors.api && <p className="mt-4 text-sm text-red-500">{formErrors.api}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Criando..." : "Criar Usuário"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
