'use client';
import Link from 'next/link';
import React from 'react';
import { House } from "@deemlol/next-icons";
import { usePathname } from 'next/navigation';
import classnames from 'classnames';


const NavBar = () => {
  
  return (
    <nav className='flex space-x-6 border-b h-12 items-center px-4 mb-5'>
      <Link href="/" className="">
        <House className='w-6 h-6' />
      </Link>
      <ul className='flex space-x-5'>
        <li><Link className='text-zinc-500 hover:text-zinc-800 transition-colors' href='Taxation'>Taxation</Link></li>
        <li><Link className='text-zinc-500 hover:text-zinc-800 transition-colors' href='Dashboard'>Dashboard</Link></li>
      </ul>
    </nav>
  )
}

export default NavBar;
