import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './LocationPickerMap.css';

// Fix leaflet icon issue in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function LocationMarker({ position, setPosition }) {
  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
    }
  });

  useEffect(() => {
    if (position) {
      map.flyTo(position, map.getZoom(), { duration: 0.5 });
    }
  }, [position, map]);

  return position === null ? null : (
    <Marker position={position} />
  );
}

export default function LocationPickerMap({ initialLat, initialLng, onLocationChange }) {
  const [position, setPosition] = useState(
    initialLat && initialLng ? { lat: parseFloat(initialLat), lng: parseFloat(initialLng) } : null
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState('');
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  // Default to Solapur center if no initial position
  const defaultCenter = [17.6599, 75.9064];
  
  useEffect(() => {
    if (position && !isFirstLoad) {
      const googleMapsLink = `https://www.google.com/maps?q=${position.lat.toFixed(6)},${position.lng.toFixed(6)}`;
      onLocationChange(position.lat.toFixed(6), position.lng.toFixed(6), googleMapsLink);
    }
    if (position && isFirstLoad) {
        setIsFirstLoad(false);
    }
  }, [position]); // only trigger when position changes

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setSearching(true);
    setError('');
    
    try {
      // Append Solapur to make searches more relevant to the city
      const query = searchQuery.toLowerCase().includes('solapur') ? searchQuery : `${searchQuery}, Solapur`;
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
      const data = await res.json();
      
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        setPosition({ lat: parseFloat(lat), lng: parseFloat(lon) });
        setIsFirstLoad(false);
      } else {
        setError('Location not found. Try dragging the map or searching a broader term.');
      }
    } catch (err) {
      setError('Search failed. Please try clicking the map manually.');
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="location-picker-container">
      <div className="location-search-bar">
        <input 
          type="text" 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)} 
          placeholder="Search a place (e.g., Station Road)..."
          onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
        />
        <button type="button" onClick={handleSearch} className="btn btn-secondary btn-sm" disabled={searching}>
          {searching ? 'Searching...' : 'Search Map'}
        </button>
      </div>
      {error && <p className="form-error">{error}</p>}
      
      <div className="map-wrapper">
        <MapContainer 
          center={position || defaultCenter} 
          zoom={13} 
          scrollWheelZoom={true} 
          style={{ height: '350px', width: '100%', borderRadius: '6px', zIndex: 1 }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker position={position} setPosition={(pos) => { setPosition(pos); setIsFirstLoad(false); }} />
        </MapContainer>
      </div>
      <p className="help-text" style={{marginTop: '0.5rem', marginBottom: 0}}>Click anywhere on the map to drop the location pin. Coordinates will be auto-filled.</p>
    </div>
  );
}
