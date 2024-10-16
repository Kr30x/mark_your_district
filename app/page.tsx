'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'

const Navbar = dynamic(() => import('@/components/navbar'), {
  ssr: false,
})

const TutorialFrame = dynamic(() => import('@/components/tutorialframe'), {
  ssr: false,
  loading: () => <p>Загрузка учебного материала...</p>
})

export default function Tutorial() {
  const [isClient, setIsClient] = useState(false)
  const [showDialog, setShowDialog] = useState(false)
  const videoRef = useRef(null)
  const router = useRouter()

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleVideoEnd = () => {
    setShowDialog(true)
  }

  const handleProceedToMark = () => {
    setShowDialog(false)
    router.push('/mark')
  }

  if (!isClient) return null

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <header className="text-center py-4">
        <h1 className="text-3xl font-bold text-gray-800">Обучение</h1>
      </header>
      <main className="flex-grow flex flex-col items-center justify-center p-20 pt-0">
        <div className='w-full'>
          <video 
            ref={videoRef}
            className='w-full aspect-video' 
            src="tutorial.mp4" 
            title="Обучающее видео" 
            controls
            onEnded={handleVideoEnd}
          />
        </div>
      </main>
      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Обучение завершено</AlertDialogTitle>
            <AlertDialogDescription>
              Поздравляем! Вы закончили просмотр обучающего видео. Хотите перейти к разделу оценки?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleProceedToMark}>
              Перейти к оценке
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}