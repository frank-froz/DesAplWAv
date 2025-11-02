"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ProjectForm } from "@/components/ProjectForm"
import { TasksTable } from "@/components/TaskTable"
import { MemberForm } from "@/components/MemberForm"
import { TaskForm } from "@/components/TaskForm"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useTheme } from "next-themes"

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

type NewProject = Omit<Project, 'id' | 'status' | 'progress' | 'team' | 'date'> & { date?: Date }

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

interface Task {
  id: number
  description: string
  projectId: number
  status: string
  priority: string
  userId: string
  dateline: Date
}

type NewTask = Omit<Task, 'id'>

type NewMember = Omit<Member, 'userId'>

export default function DashboardPage() {
  const { setTheme } = useTheme()
  const [projects, setProjects] = useState([
    {
      id: 1,
      title: "E-commerce Platform",
      description: "Plataforma de comercio electrónico con Next.js",
      status: "En progreso",
      progress: 65,
      team: 5,
      members: ["María García", "Juan Pérez"],
      category: "web",
      priority: "high",
      date: new Date("2025-11-01"),
    },
    {
      id: 2,
      title: "Mobile App",
      description: "Aplicación móvil con React Native",
      status: "En revisión",
      progress: 90,
      team: 3,
      members: ["Ana López"],
      category: "mobile",
      priority: "medium",
      date: new Date("2025-10-15"),
    },
    {
      id: 3,
      title: "Dashboard Analytics",
      description: "Panel de análisis con visualizaciones",
      status: "Planificado",
      progress: 20,
      team: 4,
      members: ["Carlos Ruiz", "Laura Martínez"],
      category: "web",
      priority: "medium",
      date: new Date("2025-11-10"),
    },
    {
      id: 4,
      title: "API Gateway",
      description: "Microservicios con Node.js",
      status: "En progreso",
      progress: 45,
      team: 6,
      members: ["Juan Pérez", "Carlos Ruiz"],
      category: "web",
      priority: "high",
      date: new Date("2025-10-20"),
    },
    {
      id: 5,
      title: "Design System",
      description: "Librería de componentes reutilizables",
      status: "Completado",
      progress: 100,
      team: 2,
      members: ["Ana López"],
      category: "design",
      priority: "low",
      date: new Date("2025-09-01"),
    },
    {
      id: 6,
      title: "Marketing Website",
      description: "Sitio web institucional",
      status: "En progreso",
      progress: 75,
      team: 3,
      members: ["Laura Martínez"],
      category: "marketing",
      priority: "medium",
      date: new Date("2025-10-25"),
    },
  ])
  const [members, setMembers] = useState<Member[]>([
    {
      userId: "1",
      role: "Frontend Developer",
      name: "María García",
      email: "maria@example.com",
      position: "Senior Developer",
      birthdate: new Date("1990-05-15"),
      phone: "+51987654321",
      projectId: 1,
      isActive: true,
    },
    {
      userId: "2",
      role: "Backend Developer",
      name: "Juan Pérez",
      email: "juan@example.com",
      position: "Lead Developer",
      birthdate: new Date("1988-03-22"),
      phone: "+51912345678",
      projectId: 2,
      isActive: true,
    },
    {
      userId: "3",
      role: "UI/UX Designer",
      name: "Ana López",
      email: "ana@example.com",
      position: "Designer",
      birthdate: new Date("1992-07-10"),
      phone: "+51998765432",
      projectId: 3,
      isActive: false,
    },
    {
      userId: "4",
      role: "DevOps Engineer",
      name: "Carlos Ruiz",
      email: "carlos@example.com",
      position: "Senior Engineer",
      birthdate: new Date("1985-11-30"),
      phone: "+51923456789",
      projectId: 4,
      isActive: true,
    },
    {
      userId: "5",
      role: "Project Manager",
      name: "Laura Martínez",
      email: "laura@example.com",
      position: "Manager",
      birthdate: new Date("1987-09-18"),
      phone: "+51934567890",
      projectId: 5,
      isActive: true,
    },
  ])
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      description: "Implementar autenticación",
      projectId: 1,
      status: "En progreso",
      priority: "Alta",
      userId: "1",
      dateline: new Date("2025-11-15"),
    },
    {
      id: 2,
      description: "Diseñar pantalla de perfil",
      projectId: 2,
      status: "Pendiente",
      priority: "Media",
      userId: "3",
      dateline: new Date("2025-11-20"),
    },
    {
      id: 3,
      description: "Configurar CI/CD",
      projectId: 4,
      status: "Completado",
      priority: "Alta",
      userId: "4",
      dateline: new Date("2025-11-10"),
    },
    {
      id: 4,
      description: "Optimizar queries SQL",
      projectId: 1,
      status: "En progreso",
      priority: "Urgente",
      userId: "2",
      dateline: new Date("2025-11-12"),
    },
    {
      id: 5,
      description: "Documentar API endpoints",
      projectId: 4,
      status: "Pendiente",
      priority: "Baja",
      userId: "5",
      dateline: new Date("2025-11-25"),
    },
  ])
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [showMemberDialog, setShowMemberDialog] = useState(false)

  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [showTaskDialog, setShowTaskDialog] = useState(false)

  // Loading state for spinner
  const [isLoading, setIsLoading] = useState(false)

  // Alert state for validations
  const [alertMessage, setAlertMessage] = useState("")
  const [alertType, setAlertType] = useState<"success" | "error" | "warning" | "info">("info")

  // Settings state
  const [settings, setSettings] = useState({
    userName: "María García",
    userEmail: "maria@example.com",
    theme: "light",
    language: "es",
    notifications: {
      email: true,
      push: false,
      inApp: true,
    },
    dashboard: {
      showStats: true,
      showRecentActivity: true,
      autoRefresh: false,
    },
    projects: {
      defaultVisibility: "private",
      autoAssignCreator: true,
      requireApproval: false,
    },
    timezone: "America/Mexico_City",
  })

  const updateNotificationSetting = (field: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [field]: value
      }
    }))
  }

  const updateDashboardSetting = (field: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      dashboard: {
        ...prev.dashboard,
        [field]: value
      }
    }))
  }

  const updateProjectSetting = (field: string, value: boolean | string) => {
    setSettings(prev => ({
      ...prev,
      projects: {
        ...prev.projects,
        [field]: value
      }
    }))
  }

  const updateThemeSetting = (value: string) => {
    setTheme(value)
    setSettings(prev => ({ ...prev, theme: value }))
  }

  // Calculate metrics
  const totalProjects = projects.length
  const completedTasks = tasks.filter(task => task.status === "Completado").length
  const activeMembers = members.filter(member => member.isActive).length
  const totalTasks = tasks.length
  const inProgressTasks = tasks.filter(task => task.status === "En progreso").length
  const pendingTasks = tasks.filter(task => task.status === "Pendiente").length

  // Calculate additional metrics
  const averageProgress = projects.length > 0
    ? Math.round(projects.reduce((sum, project) => sum + project.progress, 0) / projects.length)
    : 0
  const completedProjects = projects.filter(project => project.status === "Completado").length
  const estimatedHours = completedTasks * 8 // Assuming 8 hours per completed task

  // Generate recent activity from real data
  const getRecentActivity = () => {
    const activities = []

    // Add recent task completions
    const completedTasksList = tasks.filter(task => task.status === "Completado").slice(0, 2)
    completedTasksList.forEach(task => {
      const member = members.find(m => m.userId === task.userId)
      const project = projects.find(p => p.id === task.projectId)
      if (member && project) {
        activities.push({
          user: member.name,
          action: "completó la tarea",
          task: task.description,
          time: "Hace 2 horas"
        })
      }
    })

    // Add recent project creations
    const recentProjects = projects.slice(0, 1)
    recentProjects.forEach(project => {
      activities.push({
        user: "Sistema",
        action: "creó el proyecto",
        task: project.title,
        time: "Hace 1 día"
      })
    })

    // Add some sample activities if we don't have enough real data
    if (activities.length < 4) {
      activities.push(
        { user: "María García", action: "actualizó", task: "Documentación del proyecto", time: "Hace 3 horas" },
        { user: "Juan Pérez", action: "comentó en", task: "Revisión de código", time: "Hace 5 horas" }
      )
    }

    return activities.slice(0, 4)
  }

  const recentActivity = getRecentActivity()

  const handleAddProject = (projectData: NewProject) => {
    const newProject: Project = {
      id: projects.length + 1,
      ...projectData,
      status: "Planificado",
      progress: 0,
      team: projectData.members.length,
      date: projectData.date || new Date(),
    }
    setProjects([...projects, newProject])
  }

  const handleViewDetails = (project: Project) => {
    setSelectedProject(project)
    setShowDetails(true)
  }

  const handleDeleteProject = (projectId: number) => {
    setProjects(projects.filter(p => p.id !== projectId))
  }

  const handleAddMember = (memberData: NewMember) => {
    const newMember: Member = {
      userId: Date.now().toString(),
      ...memberData,
    }
    setMembers([...members, newMember])
  }

  const handleUpdateMember = (userId: string, memberData: NewMember) => {
    setMembers(members.map(m => m.userId === userId ? { ...m, ...memberData } : m))
  }

  const handleDeleteMember = (userId: string) => {
    setMembers(members.filter(m => m.userId !== userId))
  }

  const handleOpenAddMember = () => {
    setSelectedMember(null)
    setIsEditing(false)
    setShowMemberDialog(true)
  }

  const handleOpenEditMember = (member: Member) => {
    setSelectedMember(member)
    setIsEditing(true)
    setShowMemberDialog(true)
  }

  const handleCloseMemberDialog = () => {
    setShowMemberDialog(false)
    setSelectedMember(null)
    setIsEditing(false)
  }

  const handleSubmitMember = (memberData: NewMember) => {
    if (isEditing && selectedMember) {
      handleUpdateMember(selectedMember.userId, memberData)
    } else {
      handleAddMember(memberData)
    }
    handleCloseMemberDialog()
  }

  const addTask = (task: NewTask) => {
    const newTask: Task = {
      ...task,
      id: Math.max(...tasks.map((t) => t.id)) + 1,
    }
    setTasks([...tasks, newTask])
  }

  const updateTask = (id: number, updatedTask: Partial<Task>) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, ...updatedTask } : task)))
  }

  const deleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  const handleOpenAddTask = () => {
    setSelectedTask(null)
    setIsEditing(false)
    setShowTaskDialog(true)
  }

  const handleOpenEditTask = (task: Task) => {
    setSelectedTask(task)
    setIsEditing(true)
    setShowTaskDialog(true)
  }

  const handleCloseTaskDialog = () => {
    setShowTaskDialog(false)
    setSelectedTask(null)
    setIsEditing(false)
  }

  const handleSubmitTask = (taskData: NewTask) => {
    if (isEditing && selectedTask) {
      updateTask(selectedTask.id, taskData)
    } else {
      addTask(taskData)
    }
    handleCloseTaskDialog()
  }

  // Simulate backend call with spinner
  const handleSaveSettings = async () => {
    setIsLoading(true)
    setAlertMessage("")
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsLoading(false)
    setAlertMessage("Configuración guardada exitosamente!")
    setAlertType("success")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Dashboard de Proyectos
          </h1>
          <p className="text-slate-600">
            Gestiona tus proyectos y tareas con shadcn/ui
          </p>
          <div className="pt-4">
            <ProjectForm onAddProject={handleAddProject} />
          </div>
        </div>

        {/* Tabs Navigation */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="projects">Proyectos</TabsTrigger>
             <TabsTrigger value="tasks">Tareas</TabsTrigger>
            <TabsTrigger value="team">Equipo</TabsTrigger>
            <TabsTrigger value="settings">Configuración</TabsTrigger>
          </TabsList>

          {/* Tab: Overview */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              {/* Stat Cards */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Proyectos
                  </CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalProjects}</div>
                  <p className="text-xs text-muted-foreground">
                    {totalProjects > 0 ? `+${Math.floor(totalProjects * 0.2)} desde el mes pasado` : 'Sin proyectos previos'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Tareas Completadas
                  </CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{completedTasks}</div>
                  <p className="text-xs text-muted-foreground">
                    {totalTasks > 0 ? `${Math.round((completedTasks / totalTasks) * 100)}% del total` : 'Sin tareas'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Horas Trabajadas
                  </CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <rect width="20" height="14" x="2" y="5" rx="2" />
                    <path d="M2 10h20" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{estimatedHours}h</div>
                  <p className="text-xs text-muted-foreground">
                    {inProgressTasks > 0 ? `${inProgressTasks} tareas en progreso` : 'Todas las tareas completadas'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Miembros Activos
                  </CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{activeMembers}</div>
                  <p className="text-xs text-muted-foreground">
                    de {members.length} miembros totales
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Progreso Promedio
                  </CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M3 3v18h18" />
                    <path d="m19 9-5 5-4-4-3 3" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{averageProgress}%</div>
                  <p className="text-xs text-muted-foreground">
                    {completedProjects} proyectos completados
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Tareas Pendientes
                  </CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{pendingTasks}</div>
                  <p className="text-xs text-muted-foreground">
                    {inProgressTasks} en progreso
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Actividad Reciente</CardTitle>
                <CardDescription>
                  Últimas actualizaciones de tus proyectos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <Avatar>
                        <AvatarFallback>{activity.user[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium leading-none">
                          {activity.user}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {activity.action} <span className="font-medium">{activity.task}</span>
                        </p>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {activity.time}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Projects */}
          <TabsContent value="projects" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <Card key={project.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{project.title}</CardTitle>
                        <CardDescription>{project.description}</CardDescription>
                      </div>
                      <Badge
                        variant={
                          project.status === "Completado"
                            ? "default"
                            : project.status === "En revisión"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {project.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-muted-foreground">Progreso</span>
                          <span className="font-medium">{project.progress}%</span>
                        </div>
                        <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4"
                          >
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                          </svg>
                          {project.members.length} miembros
                        </div>
                        <Button size="sm" variant="ghost" onClick={() => handleViewDetails(project)}>
                          Ver detalles
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="destructive">
                              Eliminar
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                              <AlertDialogDescription>
                                {`Esta acción no se puede deshacer. Se eliminará el proyecto "${project.title}".`}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteProject(project.id)}>
                                Eliminar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* // Agregar nuevo TabsContent: */}
          <TabsContent value="tasks" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Gestión de Tareas</CardTitle>
                    <CardDescription>
                      Administra todas las tareas de tus proyectos
                    </CardDescription>
                  </div>
                  <Button onClick={handleOpenAddTask}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 h-4 w-4"
                    >
                      <path d="M5 12h14" />
                      <path d="M12 5v14" />
                    </svg>
                    Agregar Tarea
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <TasksTable
                  tasks={tasks}
                  projects={projects}
                  members={members}
                  onEdit={handleOpenEditTask}
                  onDelete={deleteTask}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Team */}
          <TabsContent value="team" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Miembros del Equipo</CardTitle>
                    <CardDescription>
                      Gestiona los miembros de tu equipo y sus roles
                    </CardDescription>
                  </div>
                  <Button onClick={handleOpenAddMember}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 h-4 w-4"
                    >
                      <path d="M5 12h14" />
                      <path d="M12 5v14" />
                    </svg>
                    Agregar Miembro
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {members.map((member) => (
                    <div key={member.userId} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{member.name}</p>
                          <p className="text-sm text-muted-foreground">{member.role} - {member.position}</p>
                          <p className="text-xs text-muted-foreground">{member.email}</p>
                          <p className="text-xs text-muted-foreground">{member.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={member.isActive ? "default" : "secondary"}>
                          {member.isActive ? "Activo" : "Inactivo"}
                        </Badge>
                        <Button size="sm" variant="outline" onClick={() => handleOpenEditMember(member)}>
                          Editar
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="destructive">
                              Eliminar
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                              <AlertDialogDescription>
                                {`Esta acción no se puede deshacer. Se eliminará el miembro "${member.name}".`}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteMember(member.userId)}>
                                Eliminar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Settings */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuración</CardTitle>
                <CardDescription>
                  Administra las preferencias de tu cuenta y aplicación
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Información del Usuario */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Información del Usuario</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="userName">Nombre</Label>
                      <Input
                        id="userName"
                        value={settings.userName}
                        onChange={(e) => setSettings(prev => ({ ...prev, userName: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="userEmail">Correo Electrónico</Label>
                      <Input
                        id="userEmail"
                        type="email"
                        value={settings.userEmail}
                        onChange={(e) => setSettings(prev => ({ ...prev, userEmail: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>

                {/* Apariencia */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Apariencia</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Tema</Label>
                        <p className="text-sm text-muted-foreground">
                          Elige el tema de la aplicación
                        </p>
                      </div>
                      <Select
                        value={settings.theme}
                        onValueChange={updateThemeSetting}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Claro</SelectItem>
                          <SelectItem value="dark">Oscuro</SelectItem>
                          <SelectItem value="system">Sistema</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Idioma</Label>
                        <p className="text-sm text-muted-foreground">
                          Selecciona el idioma de la interfaz
                        </p>
                      </div>
                      <Select
                        value={settings.language}
                        onValueChange={(value) => setSettings(prev => ({ ...prev, language: value }))}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="es">Español</SelectItem>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="fr">Français</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Notificaciones */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Notificaciones</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Notificaciones por Email</Label>
                        <p className="text-sm text-muted-foreground">
                          Recibe actualizaciones por correo electrónico
                        </p>
                      </div>
                      <Switch
                        checked={settings.notifications.email}
                        onCheckedChange={(checked) => updateNotificationSetting('email', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Notificaciones Push</Label>
                        <p className="text-sm text-muted-foreground">
                          Recibe notificaciones push en el navegador
                        </p>
                      </div>
                      <Switch
                        checked={settings.notifications.push}
                        onCheckedChange={(checked) => updateNotificationSetting('push', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Notificaciones en la App</Label>
                        <p className="text-sm text-muted-foreground">
                          Muestra notificaciones dentro de la aplicación
                        </p>
                      </div>
                      <Switch
                        checked={settings.notifications.inApp}
                        onCheckedChange={(checked) => updateNotificationSetting('inApp', checked)}
                      />
                    </div>
                  </div>
                </div>

                {/* Dashboard */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Dashboard</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Mostrar Estadísticas</Label>
                        <p className="text-sm text-muted-foreground">
                          Muestra las tarjetas de estadísticas en el resumen
                        </p>
                      </div>
                      <Switch
                        checked={settings.dashboard.showStats}
                        onCheckedChange={(checked) => updateDashboardSetting('showStats', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Mostrar Actividad Reciente</Label>
                        <p className="text-sm text-muted-foreground">
                          Muestra la sección de actividad reciente
                        </p>
                      </div>
                      <Switch
                        checked={settings.dashboard.showRecentActivity}
                        onCheckedChange={(checked) => updateDashboardSetting('showRecentActivity', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Actualización Automática</Label>
                        <p className="text-sm text-muted-foreground">
                          Actualiza automáticamente los datos del dashboard
                        </p>
                      </div>
                      <Switch
                        checked={settings.dashboard.autoRefresh}
                        onCheckedChange={(checked) => updateDashboardSetting('autoRefresh', checked)}
                      />
                    </div>
                  </div>
                </div>

                {/* Proyectos */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Proyectos</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Visibilidad por Defecto</Label>
                        <p className="text-sm text-muted-foreground">
                          Visibilidad por defecto para nuevos proyectos
                        </p>
                      </div>
                      <Select
                        value={settings.projects.defaultVisibility}
                        onValueChange={(value) => updateProjectSetting('defaultVisibility', value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">Público</SelectItem>
                          <SelectItem value="private">Privado</SelectItem>
                          <SelectItem value="team">Equipo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Auto-asignar Creador</Label>
                        <p className="text-sm text-muted-foreground">
                          Asigna automáticamente al creador como miembro del proyecto
                        </p>
                      </div>
                      <Switch
                        checked={settings.projects.autoAssignCreator}
                        onCheckedChange={(checked) => updateProjectSetting('autoAssignCreator', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Requiere Aprobación</Label>
                        <p className="text-sm text-muted-foreground">
                          Los nuevos proyectos requieren aprobación antes de ser visibles
                        </p>
                      </div>
                      <Switch
                        checked={settings.projects.requireApproval}
                        onCheckedChange={(checked) => updateProjectSetting('requireApproval', checked)}
                      />
                    </div>
                  </div>
                </div>

                {/* Zona Horaria */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Zona Horaria</h3>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Zona Horaria</Label>
                      <p className="text-sm text-muted-foreground">
                        Selecciona tu zona horaria
                      </p>
                    </div>
                    <Select
                      value={settings.timezone}
                      onValueChange={(value) => setSettings(prev => ({ ...prev, timezone: value }))}
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/Mexico_City">Ciudad de México (GMT-6)</SelectItem>
                        <SelectItem value="America/New_York">Nueva York (GMT-5)</SelectItem>
                        <SelectItem value="Europe/Madrid">Madrid (GMT+1)</SelectItem>
                        <SelectItem value="Europe/London">Londres (GMT+0)</SelectItem>
                        <SelectItem value="Asia/Tokyo">Tokio (GMT+9)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Botón Guardar */}
                <div className="flex justify-end pt-4">
                  <Button onClick={handleSaveSettings} disabled={isLoading}>
                    {isLoading && <Spinner className="mr-2 h-4 w-4" />}
                    Guardar Configuración
                  </Button>
                </div>

                {/* Alert for feedback */}
                {alertMessage && (
                  <Alert className={`mt-4 ${alertType === 'success' ? 'border-green-500' : alertType === 'error' ? 'border-red-500' : 'border-blue-500'}`}>
                    <AlertDescription>{alertMessage}</AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedProject?.title}</DialogTitle>
            <DialogDescription>{selectedProject?.description}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <strong>Categoría:</strong> {selectedProject?.category}
            </div>
            <div>
              <strong>Prioridad:</strong> {selectedProject?.priority}
            </div>
            <div>
              <strong>Estado:</strong> {selectedProject?.status}
            </div>
            <div>
              <strong>Progreso:</strong> {selectedProject?.progress}%
            </div>
            <div>
              <strong>Fecha de Inicio:</strong> {selectedProject?.date ? selectedProject.date.toLocaleDateString() : 'N/A'}
            </div>
            <div>
              <strong>Miembros:</strong> {selectedProject?.members.join(', ')}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showMemberDialog} onOpenChange={setShowMemberDialog}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Editar Miembro' : 'Agregar Miembro'}</DialogTitle>
            <DialogDescription>
              {isEditing ? 'Edita la información del miembro.' : 'Completa la información del nuevo miembro.'}
            </DialogDescription>
          </DialogHeader>
          <MemberForm
            member={selectedMember}
            projects={projects}
            onSubmit={handleSubmitMember}
            onCancel={handleCloseMemberDialog}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={showTaskDialog} onOpenChange={setShowTaskDialog}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Editar Tarea' : 'Agregar Tarea'}</DialogTitle>
            <DialogDescription>
              {isEditing ? 'Edita la información de la tarea.' : 'Completa la información de la nueva tarea.'}
            </DialogDescription>
          </DialogHeader>
          <TaskForm
            task={selectedTask}
            projects={projects}
            members={members}
            onSubmit={handleSubmitTask}
            onCancel={handleCloseTaskDialog}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
