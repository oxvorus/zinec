'use client';

import { MapPin } from 'lucide-react';

interface LocationData {
  province: string;
  city: string;
  total_visits: number;
  conversion_rate: number;
}

interface LocationHeatmapProps {
  data: LocationData[];
  maxValue?: number;
}

export function LocationHeatmap({ data, maxValue }: LocationHeatmapProps) {
  // Calculate max value for color scaling
  const max = maxValue || Math.max(...data.map(d => d.total_visits), 1);
  
  // Group by province
  const byProvince = data.reduce((acc, item) => {
    if (!acc[item.province]) {
      acc[item.province] = [];
    }
    acc[item.province].push(item);
    return acc;
  }, {} as Record<string, LocationData[]>);

  const getIntensityColor = (value: number) => {
    const ratio = value / max;
    if (ratio > 0.8) return 'bg-gradient-to-r from-red-500 to-orange-500'; // Very hot
    if (ratio > 0.6) return 'bg-gradient-to-r from-orange-500 to-yellow-500'; // Hot
    if (ratio > 0.4) return 'bg-gradient-to-r from-yellow-500 to-lime-500'; // Warm
    if (ratio > 0.2) return 'bg-gradient-to-r from-lime-500 to-green-500'; // Cool
    return 'bg-gradient-to-r from-cyan-400 to-blue-500'; // Very cool
  };

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-zinc-900">Peta Panas Lokasi</h3>
        <p className="text-sm text-zinc-500 mt-1">Intensitas kunjungan per daerah</p>
      </div>

      {/* Legend */}
      <div className="mb-6 flex items-center gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="h-4 w-8 rounded bg-gradient-to-r from-blue-500 to-cyan-400"></div>
          <span className="text-zinc-600">Rendah</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-8 rounded bg-gradient-to-r from-green-500 to-yellow-500"></div>
          <span className="text-zinc-600">Sedang</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-8 rounded bg-gradient-to-r from-orange-500 to-red-500"></div>
          <span className="text-zinc-600">Tinggi</span>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="space-y-4">
        {Object.entries(byProvince)
          .sort(([, a], [, b]) => 
            b.reduce((sum, d) => sum + d.total_visits, 0) - 
            a.reduce((sum, d) => sum + d.total_visits, 0)
          )
          .map(([province, cities]) => (
            <div key={province}>
              <h4 className="text-sm font-semibold text-zinc-700 mb-2 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-zinc-500" />
                {province}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {cities
                  .sort((a, b) => b.total_visits - a.total_visits)
                  .map((city) => (
                    <div
                      key={`${province}-${city.city}`}
                      className={`rounded-lg p-3 text-white ${getIntensityColor(city.total_visits)} transition-all hover:shadow-md`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">{city.city}</span>
                        <span className="text-xs font-bold">{city.total_visits}</span>
                      </div>
                      <div className="mt-1 flex items-center justify-between text-xs opacity-90">
                        <span>Konversi</span>
                        <span>{city.conversion_rate.toFixed(1)}%</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
      </div>

      {/* Empty State */}
      {data.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <MapPin className="h-12 w-12 text-zinc-300 mb-2" />
          <p className="text-zinc-500">Belum ada data lokasi</p>
        </div>
      )}
    </div>
  );
}
