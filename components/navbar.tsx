import React from 'react'
import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white font-bold text-xl">
          Разметка Московских районов
        </Link>
        <div>
          <Link href="/" className="text-white mr-4">
            Разметка
          </Link>
          <Link href="/gallery" className="text-white">
            Галерея
          </Link>
        </div>
      </div>
    </nav>
  )
}