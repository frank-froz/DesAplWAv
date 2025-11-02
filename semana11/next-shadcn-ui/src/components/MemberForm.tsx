"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { DialogFooter } from "@/components/ui/dialog"

interface Project {
  id: number
  title: string
  description: string
  status: string
  progress: number
  team: number
  members: string[]
  category: string
  priority: string
  date: Date
}

interface Member {
  userId: string
  role: string
  name: string
  email: string
  position: string
  birthdate: Date
  phone: string
  projectId: number | null
  isActive: boolean
}

type NewMember = Omit<Member, 'userId'>

interface MemberFormProps {
  member: Member | null
  projects: Project[]
  onSubmit: (data: NewMember) => void
  onCancel: () => void
}

export function MemberForm({ member, projects, onSubmit, onCancel }: MemberFormProps) {
  const [formData, setFormData] = useState<NewMember>({
    role: "",
    name: "",
    email: "",
    position: "",
    birthdate: new Date(),
    phone: "",
    projectId: null,
    isActive: true,
  })

  const [errors, setErrors] = useState<string[]>([])

  useEffect(() => {
    if (member) {
      setFormData({
        role: member.role,
        name: member.name,
        email: member.email,
        position: member.position,
        birthdate: member.birthdate,
        phone: member.phone,
        projectId: member.projectId,
        isActive: member.isActive,
      })
    } else {
      setFormData({
        role: "",
        name: "",
        email: "",
        position: "",
        birthdate: new Date(),
        phone: "",
        projectId: null,
        isActive: true,
      })
    }
    setErrors([])
  }, [member])

  const validateForm = (): string[] => {
    const newErrors: string[] = []
    
    if (!formData.name.trim()) {
      newErrors.push("El nombre es requerido")
    }
    
    if (!formData.email.trim()) {
      newErrors.push("El email es requerido")
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.push("El email no tiene un formato válido")
    }
    
    if (!formData.role.trim()) {
      newErrors.push("El rol es requerido")
    }
    
    if (!formData.position.trim()) {
      newErrors.push("La posición es requerida")
    }
    
    if (!formData.phone.trim()) {
      newErrors.push("El teléfono es requerido")
    } else if (!/^\+51[9]\d{8}$/.test(formData.phone)) {
      newErrors.push("El teléfono debe tener el formato +51 seguido de 9 dígitos que empiecen con 9")
    }
    
    const age = new Date().getFullYear() - formData.birthdate.getFullYear()
    if (age < 18) {
      newErrors.push("El miembro debe ser mayor de 18 años")
    }
    
    return newErrors
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const validationErrors = validateForm()
    
    if (validationErrors.length > 0) {
      setErrors(validationErrors)
      return
    }
    
    setErrors([])
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit}>
      {errors.length > 0 && (
        <Alert className="mb-4 border-red-500">
          <AlertDescription>
            <ul className="list-disc list-inside">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}
      
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Nombre</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="role">Rol</Label>
          <Input
            id="role"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="position">Posición</Label>
          <Input
            id="position"
            value={formData.position}
            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="phone">Teléfono</Label>
          <div className="flex gap-2">
            <Input
              value="+51"
              disabled
              className="w-16"
            />
            <Input
              id="phone"
              placeholder="987654321"
              value={formData.phone.replace('+51', '')}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 9)
                setFormData({ ...formData, phone: `+51${value}` })
              }}
              maxLength={9}
              pattern="9[0-9]{8}"
              required
            />
          </div>
          <p className="text-xs text-muted-foreground">Debe empezar con 9 y tener 9 dígitos</p>
        </div>

        <div className="grid gap-2">
          <Label>Fecha de Nacimiento</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.birthdate ? formData.birthdate.toLocaleDateString() : "Selecciona una fecha"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <div className="p-3 border-b">
                <Label>Año</Label>
                <Select
                  value={formData.birthdate.getFullYear().toString()}
                  onValueChange={(year) => {
                    const newDate = new Date(formData.birthdate)
                    newDate.setFullYear(parseInt(year))
                    setFormData({ ...formData, birthdate: newDate })
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px]">
                    {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - 18 - i).map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Calendar
                mode="single"
                selected={formData.birthdate}
                onSelect={(date) => date && setFormData({ ...formData, birthdate: date })}
                initialFocus
                fromYear={1920}
                toYear={new Date().getFullYear() - 18}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="project">Proyecto Asignado</Label>
          <Select
            value={formData.projectId?.toString() || "none"}
            onValueChange={(value) => setFormData({ ...formData, projectId: value === "none" ? null : parseInt(value) })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona un proyecto" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Ninguno</SelectItem>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id.toString()}>
                  {project.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="isActive"
            checked={formData.isActive}
            onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
          />
          <Label htmlFor="isActive">Activo</Label>
        </div>
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          {member ? 'Actualizar' : 'Crear'} Miembro
        </Button>
      </DialogFooter>
    </form>
  )
}