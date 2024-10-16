'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

const Navbar = dynamic(() => import('@/components/navbar'), {
  ssr: false,
})

const CityMapDrawing = dynamic(() => import('@/components/mapdraw'), {
  ssr: false,
  loading: () => <p>Loading Map...</p>
})

export default function Home() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) return null

  return (
    <>
      <Navbar />
      <CityMapDrawing />
    </>
  )
}