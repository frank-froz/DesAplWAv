import Link from 'next/link';
import { AiFillHome, AiOutlineSearch, AiOutlineCalendar, AiOutlineDesktop, AiOutlineVideoCamera, AiOutlinePlus } from 'react-icons/ai';

export default function Sidebar() {
  return (
    <div className="w-20 h-screen fixed left-0 top-0 z-50 flex flex-col items-center py-4 bg-gradient-to-r from-black/90 via-black/50 to-transparent">
      <div className="mb-8">
        <h1 className="text-red-600 text-4xl font-bold">N</h1>
      </div>
      <nav className="flex-1 flex flex-col justify-center">
        <ul className="flex flex-col items-center space-y-8">
          <li>
            <Link href="/" className="text-white hover:text-red-600 text-2xl">
              <AiFillHome />
            </Link>
          </li>
          <li>
            <Link href="/search" className="text-white hover:text-red-600 text-2xl">
              <AiOutlineSearch />
            </Link>
          </li>
          <li className="text-white text-2xl opacity-60">
            <AiOutlineCalendar />
          </li>
          <li className="text-white text-2xl opacity-60">
            <AiOutlineDesktop />
          </li>
          <li className="text-white text-2xl opacity-60">
            <AiOutlineVideoCamera />
          </li>
          <li className="text-white text-2xl opacity-60">
            <AiOutlinePlus />
          </li>
        </ul>
      </nav>
    </div>
  );
}