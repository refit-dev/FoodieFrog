'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the map component with no SSR
const MapComponent = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-96 bg-gray-200 flex items-center justify-center">
      <div className="text-gray-500">Loading map...</div>
    </div>
  )
});

export default function LazyMapComponent(props) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="w-full h-96 bg-gray-200 flex items-center justify-center">
        <div className="text-gray-500">Loading map...</div>
      </div>
    );
  }

  return <MapComponent {...props} />;
}