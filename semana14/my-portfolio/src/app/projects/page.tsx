import { projects } from "@/lib/data";
import { Metadata } from "next";
import ProjectCard from "@/components/ProjectCard";


export const metadata: Metadata =  {
    title: 'Proyectos',
    description: 'Explora mi colección de proyectos de desarrollo web full stack utilizando Next.js, React y TypeScript.',
    openGraph: {
        title: 'Proyectos - Portafolio',
        description: 'Explora una selección de proyectos destacados que demuestran mis habilidades en desarrollo web full stack utilizando tecnologías modernas como Next.js, React y TypeScript.',
        images: ['/og-projects.jpg'],
    },
};

export default function ProjectsPage() {
    return (
        <div className="min-h-screen py-20 px-4">
            <div className="container mx-auto max-w-6xl">
                <div className="mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Proyectos</h1>
                    <p className="text-lg text-gray-400 max-w-2xl">
                        Una colección de proyectos de desarrollo web que demuestran mis habilidades técnicas y creatividad.
                    </p>
                </div>

                <div>
                    {projects.map((project, index) => (
                        <ProjectCard 
                            key={project.slug} 
                            project={project} 
                            reverse={index % 2 !== 0}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

