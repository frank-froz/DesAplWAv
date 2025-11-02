"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"

interface Task {
  id: number
  description: string
  projectId: number
  status: string
  priority: string
  userId: string
  dateline: Date
}

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

type NewTask = Omit<Task, 'id'>

interface TaskFormProps {
  task?: Task | null
  projects: Project[]
  members: Member[]
  onSubmit: (task: NewTask) => void
  onCancel: () => void
}

export function TaskForm({ task, projects, members, onSubmit, onCancel }: TaskFormProps) {
  const [description, setDescription] = useState(task?.description || "")
  const [projectId, setProjectId] = useState(task?.projectId.toString() || "")
  const [status, setStatus] = useState(task?.status || "")
  const [priority, setPriority] = useState(task?.priority || "")
  const [userId, setUserId] = useState(task?.userId || "")
  const [dateline, setDateline] = useState<Date | undefined>(task?.dateline)

  useEffect(() => {
    if (task) {
      setDescription(task.description)
      setProjectId(task.projectId.toString())
      setStatus(task.status)
      setPriority(task.priority)
      setUserId(task.userId)
      setDateline(task.dateline)
    } else {
      setDescription("")
      setProjectId("")
      setStatus("")
      setPriority("")
      setUserId("")
      setDateline(undefined)
    }
  }, [task])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!description || !projectId || !status || !priority || !userId || !dateline) {
      return
    }

    const taskData: NewTask = {
      description,
      projectId: parseInt(projectId),
      status,
      priority,
      userId,
      dateline,
    }

    onSubmit(taskData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="description">Descripción</Label>
        <Input
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe la tarea..."
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="project">Proyecto</Label>
        <Select value={projectId} onValueChange={setProjectId} required>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona un proyecto" />
          </SelectTrigger>
          <SelectContent>
            {projects.map((project) => (
              <SelectItem key={project.id} value={project.id.toString()}>
                {project.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Estado</Label>
        <Select value={status} onValueChange={setStatus} required>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona el estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Pendiente">Pendiente</SelectItem>
            <SelectItem value="En progreso">En progreso</SelectItem>
            <SelectItem value="Completado">Completado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="priority">Prioridad</Label>
        <Select value={priority} onValueChange={setPriority} required>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona la prioridad" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Baja">Baja</SelectItem>
            <SelectItem value="Media">Media</SelectItem>
            <SelectItem value="Alta">Alta</SelectItem>
            <SelectItem value="Urgente">Urgente</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="member">Asignado a</Label>
        <Select value={userId} onValueChange={setUserId} required>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona un miembro" />
          </SelectTrigger>
          <SelectContent>
            {members.map((member) => (
              <SelectItem key={member.userId} value={member.userId}>
                {member.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Fecha límite</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !dateline && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateline ? format(dateline, "PPP", { locale: es }) : <span>Selecciona una fecha</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={dateline}
              onSelect={setDateline}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          {task ? 'Actualizar' : 'Crear'} Tarea
        </Button>
      </div>
    </form>
  )
}