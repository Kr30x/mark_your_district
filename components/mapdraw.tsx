'use client'

import React, { useRef, useState, useEffect } from 'react';
import { MapContainer, TileLayer, FeatureGroup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-draw';
import L from 'leaflet';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";


declare module 'leaflet' {
  namespace Icon {
    interface DefaultIconOptions extends L.IconOptions {
      iconRetinaUrl: string;
      iconUrl: string;
      shadowUrl: string;
    }
  }
}

interface ExtendedIconDefault extends L.Icon.Default {
  _getIconUrl?: () => string;
}

const IconDefault = L.Icon.Default as unknown as {
  prototype: ExtendedIconDefault;
  mergeOptions(options: L.Icon.DefaultIconOptions): void;
};

if (IconDefault.prototype._getIconUrl) {
  delete IconDefault.prototype._getIconUrl;
}
if (window !== undefined){
IconDefault.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png',
})};

const moscowDistricts: string[] = [
  "Красногорск",
];

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

function ErrorBoundary({ children }: ErrorBoundaryProps): JSX.Element {
  const [hasError, setHasError] = useState<boolean>(false);
  
  if (hasError) {
    return <h1>Что-то пошло не так.</h1>;
  }

  return <>{children}</>;
}

interface DrawingData {
  district: string;
  geoJSON: GeoJSON.FeatureCollection;
}

export default function CityMapDrawing(): JSX.Element {
  const [drawnItems, setDrawnItems] = useState<L.FeatureGroup | null>(null);
  const [district, setDistrict] = useState<string>("");
  const mapRef = useRef<L.Map | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    console.log("CityMapDrawing смонтирован");
    setDrawnItems(new L.FeatureGroup());
  }, []);

  const handleCreated = (e: L.LeafletEvent): void => {
    console.log("handleCreated вызван", e);
    if (e.type === 'draw:created' && 'layer' in e) {
      const layer = e.layer as L.Layer;
      if (drawnItems) {
        drawnItems.addLayer(layer);
        setDrawnItems(new L.FeatureGroup(drawnItems.getLayers()));
      }
    }
  };

  const handleSubmit = (): void => {
    if (!district) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, выберите район перед отправкой.",
        variant: "destructive",
      });
      return;
    }

    if (!drawnItems || drawnItems.getLayers().length === 0) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, нарисуйте область на карте перед отправкой.",
        variant: "destructive",
      });
      return;
    }

    const drawingData: DrawingData = {
      district: district,
      geoJSON: drawnItems.toGeoJSON() as GeoJSON.FeatureCollection
    };

    console.log("Сохранение данных рисунка:", drawingData);

    // Сохранение в localStorage
    const savedDrawings: DrawingData[] = JSON.parse(localStorage.getItem('savedDrawings') || '[]');
    savedDrawings.push(drawingData);
    localStorage.setItem('savedDrawings', JSON.stringify(savedDrawings));

    toast({
      title: "Успех",
      description: "Ваш рисунок был сохранен.",
    });

    // Сброс формы
    setDistrict("");
    drawnItems.clearLayers();
  };

  return (
    <ErrorBoundary>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <h1 className="text-2xl font-bold mb-4">Обведи свой район</h1>
        <div className="relative z-50 mb-4">
          <Select onValueChange={setDistrict} value={district}>
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Выберите район" />
            </SelectTrigger>
            <SelectContent>
              {moscowDistricts.map((d) => (
                <SelectItem key={d} value={d}>{d}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-full max-w-5xl bg-white rounded-lg shadow-lg overflow-hidden mt-4 relative z-0">
          {drawnItems && (
            <MapContainer
              center={[55.7558, 37.6173]} // Координаты Москвы
              zoom={10}
              style={{ height: '600px', width: '100%' }}
              ref={mapRef}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <FeatureGroup ref={setDrawnItems}>
                <EditControl
                  position="topright"
                  onCreated={handleCreated}
                  draw={{
                    rectangle: false,
                    circle: false,
                    circlemarker: false,
                    marker: false,
                    polyline: false,
                  }}
                />
              </FeatureGroup>
            </MapContainer>
          )}
        </div>
        <Button onClick={handleSubmit} className="mt-4">
          Отправить рисунок
        </Button>
      </div>
    </ErrorBoundary>
  );
}