import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-[#0f1419] border-b border-gray-800 sticky top-0 z-50 backdrop-blur-sm bg-opacity-90">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-end gap-8">
          <ul className="flex items-center gap-8">
            <li>
              <Link
                href="/#experiencia"
                className="text-gray-300 hover:text-blue-300 transition font-medium"
              >
                Experiencia
              </Link>
            </li>
            <li>
              <Link
                href="/projects"
                className="text-gray-300 hover:text-white transition font-medium"
              >
                Proyectos
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="text-gray-300 hover:text-white transition font-medium"
              >
                Sobre mí
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="text-gray-300 hover:text-white transition font-medium"
              >
                Contacto
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}