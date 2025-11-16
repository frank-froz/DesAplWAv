'use client';

import Link from "next/link";
import LogoutButton from "./LogoutButton";
import { useSession } from "next-auth/react";
import Image from "next/image";

export default function NavBar() {
  const { data: session } = useSession();

  return (
    <nav className="w-full bg-black shadow-sw">
      <div className="mx-auth px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-semibold">
          MyAuthApp
        </Link>
        <ul className="flex items-center justify-center gap-6 text-sm">
          <li>
            <Link href="/dashboard" className="hover:text-gray-600">
              Dashboard
            </Link>
          </li>
          <li>
            <Link href="/profile" className="hover:text-gray-600">
              Profile
            </Link>
          </li>
          {!session?.user && (
            <li>
              <Link href="/signIn" className="hover:text-gray-600">
                Sign In
              </Link>
            </li>
          )}
          {session?.user && (
            <li>
              <LogoutButton />
            </li>
          )}
          {session?.user?.image && (
            <li>
              <Image
                height={100}
                width={100}
                src={session.user.image}
                alt="Profile"
                className="w-10 h-10 rounded-full"
              />
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}
