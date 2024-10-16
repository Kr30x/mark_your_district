"use client"

import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Dynamically import MapContainer and related components with SSR disabled
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const GeoJSON = dynamic(() => import('react-leaflet').then(mod => mod.GeoJSON), { ssr: false });

interface Drawing {
  district: string;
  geoJSON: GeoJSON.FeatureCollection;
}

export default function GalleryPage() {
  const [savedDrawings, setSavedDrawings] = useState<Drawing[]>([])
  const [currentView, setCurrentView] = useState<'gallery' | 'fullscreen'>('gallery')
  const [selectedDrawing, setSelectedDrawing] = useState<Drawing | null>(null)
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all')
  const { toast } = useToast()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      loadDrawings()
    }
  }, [])

  const loadDrawings = () => {
    const drawings: Drawing[] = JSON.parse(localStorage.getItem('savedDrawings') || '[]')
    setSavedDrawings(drawings)
  }

  const handleDelete = (index: number, e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const updatedDrawings = savedDrawings.filter((_, i) => i !== index);
    localStorage.setItem('savedDrawings', JSON.stringify(updatedDrawings));
    setSavedDrawings(updatedDrawings);
    toast({
      title: "Успех",
      description: "Рисунок успешно удален.",
    });
  };

  const openFullscreen = (drawing: Drawing | null): void => {
    setSelectedDrawing(drawing);
    setCurrentView('fullscreen');
  }

  const closeView = (): void => {
    setCurrentView('gallery');
    setSelectedDrawing(null);
  }

  const getUniqueDistricts = (): string[] => {
    const districts = savedDrawings.map((drawing: Drawing) => drawing.district);
    return ['all', ...Array.from(new Set(districts))];
  }

  const filteredDrawings = selectedDistrict === 'all' 
    ? savedDrawings 
    : savedDrawings.filter(drawing => drawing.district === selectedDistrict)

  const renderGallery = () => (
    <>
      <div className="mb-4 relative z-50">
        <Select onValueChange={setSelectedDistrict} value={selectedDistrict}>
          <SelectTrigger className="w-[280px]">
            <SelectValue placeholder="Выберите район" />
          </SelectTrigger>
          <SelectContent className="z-[60]">
            {getUniqueDistricts().map((district) => (
              <SelectItem key={district} value={district}>
                {district === 'all' ? 'Все районы' : district}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDrawings.map((drawing, index) => (
          <Card key={index} className="flex flex-col">
            <CardHeader>
              <CardTitle>{drawing.district}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="h-[200px]" onClick={() => openFullscreen(drawing)}>
                <MapContainer
                  center={[55.7558, 37.6173]}
                  zoom={10}
                  style={{ height: '100%', width: '100%' }}
                  zoomControl={false}
                  dragging={false}
                  touchZoom={false}
                  doubleClickZoom={false}
                  scrollWheelZoom={false}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <GeoJSON data={drawing.geoJSON} />
                </MapContainer>
              </div>
            </CardContent>
            <CardFooter className="justify-end">
              <Button
                variant="destructive"
                size="sm"
                onClick={(e) => handleDelete(index, e)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Удалить
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  )

  const renderFullscreen = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full h-full max-w-[90vw] max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-bold">{selectedDrawing?.district}</h2>
          <Button variant="ghost" size="lg" onClick={closeView}>
            <X className="h-8 w-8" />
          </Button>
        </div>
        <div className="flex-grow">
          <MapContainer
            center={[55.7558, 37.6173]}
            zoom={10}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {selectedDrawing && <GeoJSON data={selectedDrawing.geoJSON} />}
          </MapContainer>
        </div>
      </div>
    </div>
  )

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Галерея сохраненных рисунков</h1>
      {currentView === 'gallery' && renderGallery()}
      {currentView === 'fullscreen' && selectedDrawing && renderFullscreen()}
    </div>
  )
}
