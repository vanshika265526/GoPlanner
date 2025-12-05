import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in React-Leaflet
if (typeof window !== 'undefined') {
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  });
}

// Custom marker icon with better visibility
const createCustomIcon = (color = '#3b82f6') => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: 32px;
        height: 32px;
        background-color: ${color};
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          width: 12px;
          height: 12px;
          background-color: white;
          border-radius: 50%;
        "></div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

export const ItineraryMap = ({ activities = [], destination, coordinates }) => {
  const [isClient, setIsClient] = useState(false);
  const [MapComponents, setMapComponents] = useState(null);
  const [mapInstance, setMapInstance] = useState(null);

  useEffect(() => {
    setIsClient(true);
    
    // Dynamic import to avoid SSR issues
    if (typeof window !== 'undefined') {
      import('react-leaflet').then((leaflet) => {
        setMapComponents({
          MapContainer: leaflet.MapContainer,
          TileLayer: leaflet.TileLayer,
          Marker: leaflet.Marker,
          Popup: leaflet.Popup,
          useMap: leaflet.useMap,
          ZoomControl: leaflet.ZoomControl,
          useMapEvents: leaflet.useMapEvents,
        });
      }).catch((err) => {
        console.error('Failed to load react-leaflet:', err);
      });
    }
  }, []);

  // Component to fit map bounds to show all markers
  const MapBounds = ({ activities: acts }) => {
    const map = MapComponents?.useMap ? MapComponents.useMap() : null;
    
    useEffect(() => {
      if (map && acts.length > 0 && typeof window !== 'undefined') {
        const bounds = L.latLngBounds(
          acts
            .filter(a => a.coordinates && a.coordinates.lat && a.coordinates.lng)
            .map(a => [a.coordinates.lat, a.coordinates.lng])
        );
        
        if (bounds.isValid()) {
          map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
        }
      }
    }, [acts, map]);
    
    return null;
  };

  // Component to enable zoom on scroll wheel
  const MapZoomHandler = () => {
    const map = MapComponents?.useMap ? MapComponents.useMap() : null;
    const useMapEvents = MapComponents?.useMapEvents;
    
    useEffect(() => {
      if (map && typeof window !== 'undefined') {
        // Enable scroll wheel zoom
        map.scrollWheelZoom.enable();
        
        // Enable double-click zoom
        map.doubleClickZoom.enable();
        
        // Enable keyboard navigation
        map.keyboard.enable();
        
        // Enable touch zoom for mobile
        map.touchZoom.enable();
        
        // Store map instance
        setMapInstance(map);
      }
    }, [map]);
    
    return null;
  };

  // Component for custom zoom controls
  const CustomZoomControl = () => {
    const map = MapComponents?.useMap ? MapComponents.useMap() : null;
    
    if (!map) return null;
    
    return (
      <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2 bg-white dark:bg-[#020617] rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
        <button
          onClick={() => map.zoomIn()}
          className="px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center justify-center"
          aria-label="Zoom in"
          title="Zoom in"
        >
          <span className="material-symbols-outlined text-slate-700 dark:text-slate-300">add</span>
        </button>
        <div className="h-px bg-slate-200 dark:bg-slate-700"></div>
        <button
          onClick={() => map.zoomOut()}
          className="px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center justify-center"
          aria-label="Zoom out"
          title="Zoom out"
        >
          <span className="material-symbols-outlined text-slate-700 dark:text-slate-300">remove</span>
        </button>
        <div className="h-px bg-slate-200 dark:bg-slate-700"></div>
        <button
          onClick={() => {
            const validActivities = (activities || []).filter(
              a => a.coordinates && a.coordinates.lat && a.coordinates.lng
            );
            if (validActivities.length > 0) {
              const bounds = L.latLngBounds(
                validActivities.map(a => [a.coordinates.lat, a.coordinates.lng])
              );
              if (bounds.isValid()) {
                map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
              }
            }
          }}
          className="px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center justify-center"
          aria-label="Fit all markers"
          title="Fit all markers"
        >
          <span className="material-symbols-outlined text-slate-700 dark:text-slate-300 text-lg">fit_screen</span>
        </button>
      </div>
    );
  };

  if (!isClient || typeof window === 'undefined') {
    return (
      <div className="w-full h-full bg-slate-100 dark:bg-[#020617] rounded-2xl flex items-center justify-center border border-slate-200 dark:border-slate-700">
        <div className="text-center p-4">
          <span className="material-symbols-outlined text-4xl text-slate-400 mb-2 animate-pulse">map</span>
          <p className="text-slate-500 dark:text-slate-400">Loading map...</p>
        </div>
      </div>
    );
  }

  if (!MapComponents) {
    return (
      <div className="w-full h-full bg-slate-100 dark:bg-[#020617] rounded-2xl flex items-center justify-center border border-slate-200 dark:border-slate-700">
        <div className="text-center p-4">
          <span className="material-symbols-outlined text-4xl text-slate-400 mb-2">map</span>
          <p className="text-slate-500 dark:text-slate-400">Initializing map...</p>
        </div>
      </div>
    );
  }

  const { MapContainer, TileLayer, Marker, Popup } = MapComponents;

  const validActivities = (activities || []).filter(
    a => a.coordinates && a.coordinates.lat && a.coordinates.lng
  );

  const center = coordinates 
    ? [coordinates.lat, coordinates.lng]
    : validActivities.length > 0
    ? [validActivities[0].coordinates.lat, validActivities[0].coordinates.lng]
    : [48.8566, 2.3522]; // Default to Paris

  if (validActivities.length === 0 && !coordinates) {
    return (
      <div className="w-full h-full bg-slate-100 dark:bg-[#020617] rounded-2xl flex items-center justify-center border border-slate-200 dark:border-slate-700">
        <div className="text-center p-4">
          <span className="material-symbols-outlined text-4xl text-slate-400 mb-2">map</span>
          <p className="text-slate-500 dark:text-slate-400">Map will appear when locations are available</p>
        </div>
      </div>
    );
  }

  // Get marker color based on activity type
  const getMarkerColor = (activity) => {
    if (activity.type === 'dining') return '#ef4444'; // red
    if (activity.type === 'sightseeing') return '#3b82f6'; // blue
    if (activity.type === 'accommodation') return '#10b981'; // green
    return '#8b5cf6'; // purple
  };

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 relative">
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
        scrollWheelZoom={true}
        doubleClickZoom={true}
        zoomControl={false}
        keyboard={true}
        touchZoom={true}
      >
        {/* Use a clearer tile layer */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
          minZoom={2}
        />
        
        <MapBounds activities={validActivities} />
        <MapZoomHandler />
        <CustomZoomControl />
        
        {validActivities.map((activity, index) => {
          const customIcon = createCustomIcon(getMarkerColor(activity));
          
          return (
            <Marker
              key={activity.id || index}
              position={[activity.coordinates.lat, activity.coordinates.lng]}
              icon={customIcon}
            >
              <Popup
                className="custom-popup"
                maxWidth={250}
                autoPan={true}
                closeButton={true}
              >
                <div className="text-sm p-1">
                  <div className="flex items-start gap-2 mb-2">
                    <span className="material-symbols-outlined text-primary text-lg">
                      {activity.type === 'dining' ? 'restaurant' : 
                       activity.type === 'sightseeing' ? 'camera' : 
                       activity.type === 'accommodation' ? 'hotel' : 
                       'place'}
                    </span>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900">{activity.activity}</p>
                      <p className="text-xs text-slate-600 mt-0.5">{activity.time}</p>
                    </div>
                  </div>
                  {activity.location && (
                    <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">location_on</span>
                      {activity.location}
                    </p>
                  )}
                  {activity.rating && activity.rating !== 'N/A' && (
                    <p className="text-xs text-slate-600 mt-1">⭐ {activity.rating}</p>
                  )}
                  {activity.notes && (
                    <p className="text-xs text-slate-500 mt-2 italic">{activity.notes}</p>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
      
      {/* Map legend */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-white dark:bg-[#020617] rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 p-3 text-xs">
        <p className="font-semibold text-slate-900 dark:text-white mb-2">Legend</p>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500 border-2 border-white shadow-sm"></div>
            <span className="text-slate-600 dark:text-slate-400">Sightseeing</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500 border-2 border-white shadow-sm"></div>
            <span className="text-slate-600 dark:text-slate-400">Dining</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500 border-2 border-white shadow-sm"></div>
            <span className="text-slate-600 dark:text-slate-400">Accommodation</span>
          </div>
        </div>
      </div>
      
      {/* Instructions */}
      <div className="absolute top-4 left-4 z-[1000] bg-white/95 dark:bg-[#020617]/95 backdrop-blur-sm rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 p-2 text-xs text-slate-600 dark:text-slate-400">
        <p>🖱️ Scroll to zoom • Double-click to zoom in</p>
      </div>
    </div>
  );
};
