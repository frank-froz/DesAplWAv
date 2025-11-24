import { Project } from '@/types';

export const projects: Project[] = [
  {
    slug: 'kaimaki',
    title: 'KaiMaki – Conecta con Técnicos de Confianza',
    description: 'Plataforma web y móvil para conectar usuarios con técnicos especializados en gasfitería, electricidad, reparación de electrodomésticos y más',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    technologies: ['React', 'Kotlin', 'Spring Boot', 'MySQL', 'Tailwind CSS'],
    githubUrl: 'https://github.com/frank-froz/KaiMaki',
    featured: true,
  },
  {
    slug: 'ecommerce-platform',
    title: 'E-commerce Platform',
    description: 'Plataforma de comercio electrónico con Next.js, Stripe y PostgreSQL',
    image: 'https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=928&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    technologies: ['Next.js', 'TypeScript', 'Stripe', 'PostgreSQL', 'Tailwind'],
    githubUrl: 'https://github.com/usuario/ecommerce',
    featured: true,
  },
  {
    slug: 'task-manager',
    title: 'Task Manager App',
    description: 'Aplicación de gestión de tareas con autenticación y tiempo real',
    image: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?q=80&w=928&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    technologies: ['React', 'Node.js', 'Socket.io', 'MongoDB'],
    githubUrl: 'https://github.com/usuario/task-manager',
    featured: false,
  },
];

export const personalInfo = {
  name: 'Franklin Huaytalla',
  title: 'Desarrollador de Software',
  description: 'Estudiante de 5.º ciclo de Diseño y Desarrollo de Software en TECSUP con experiencia en desarrollo web empresarial',
  email: 'fahuaytalla@gmail.com',
  github: 'https://github.com/frank-froz',
  linkedin: 'https://www.linkedin.com/in/franklin-huaytalla-rodriguez/',
  siteUrl: 'https://tuportafolio.com',
  avatar: '/profile.jpg',
};
