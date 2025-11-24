import { personalInfo, projects } from "@/lib/data";
import Link from "next/link";
import ProjectCard from "@/components/ProjectCard";

export default function Home() {
  const featuredProjects = projects.slice(0, 2);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="flex flex-col items-center text-center gap-8">

            {/* Título y Descripción */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold text-white">
                Hey, soy {personalInfo.name.split(' ')[0]}
              </h1>
              <p className="text-xl md:text-2xl text-gray-300">
                <span className="text-yellow-400 font-semibold">{personalInfo.title}</span>
              </p>
              <p className="text-lg text-gray-400 max-w-2xl">
                Especializado en el desarrollo de aplicaciones web y experiencias digitales excepcionales.
              </p>
            </div>

            {/* Botones CTA */}
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-gray-800 text-white px-6 py-3 rounded-lg border border-gray-700 hover:bg-gray-700 transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Contáctame
              </Link>
              <Link
                href={personalInfo.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-transparent text-gray-300 px-6 py-3 rounded-lg border border-gray-700 hover:border-gray-600 hover:text-white transition"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                LinkedIn
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de Experiencia Laboral */}
      <section id="experiencia" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center gap-3 mb-12">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <h2 className="text-3xl font-bold text-white">
              Experiencia Laboral
            </h2>
          </div>

          <div className="bg-[#1a1f2e] rounded-lg border border-gray-800 p-8">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">Pasante de Desarrollo de Software</h3>
                <p className="text-yellow-400 font-semibold">Sapiens Consulting E.I.R.L.</p>
              </div>
              <span className="text-gray-400 text-sm mt-2 md:mt-0">Jul 2025 - Oct 2025</span>
            </div>
            
            <p className="text-gray-300 mb-4 text-sm">
              Consultoría peruana especializada en desarrollo de software empresarial y soluciones de gestión de recursos humanos.
            </p>

            <ul className="space-y-3 mb-6">
              <li className="flex gap-3 text-gray-300">
                <span className="text-yellow-400 mt-1">▹</span>
                <span>Desarrollé sistema de evaluación de desempeño 360° con plantillas personalizables, módulo de auditoría y reportes analíticos, digitalizando el proceso semestral de evaluaciones.</span>
              </li>
              <li className="flex gap-3 text-gray-300">
                <span className="text-yellow-400 mt-1">▹</span>
                <span>Implementé funcionalidades para plataforma web interna, incluyendo automatización de gestión de horarios, dashboards de planificación y APIs REST.</span>
              </li>
              <li className="flex gap-3 text-gray-300">
                <span className="text-yellow-400 mt-1">▹</span>
                <span>Administré sistema de soporte técnico con notificaciones automáticas y alertas SLA, reduciendo tiempos de respuesta.</span>
              </li>
            </ul>

            <div className="flex flex-wrap gap-2">
              {['Python', 'Django', 'MySQL', 'JavaScript', 'Bootstrap'].map((tech) => (
                <span
                  key={tech}
                  className="text-xs px-3 py-1 bg-gray-800 text-gray-300 rounded-full border border-gray-700"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Sección de Proyectos Destacados */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center gap-3 mb-16">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h2 className="text-3xl font-bold text-white">
              Proyectos Destacados
            </h2>
          </div>
          <div>
            {featuredProjects.map((project, index) => (
              <ProjectCard 
                key={project.slug} 
                project={project} 
                reverse={index % 2 !== 0}
              />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition font-medium"
            >
              Ver todos los proyectos
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
