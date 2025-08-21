import { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
import L, { DivIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Pet } from '../pets';



// Calabria center
const CALABRIA_CENTER: [number, number] = [38.905, 16.594];
const DEFAULT_ZOOM = 8;

// Build a DivIcon so we don't need Leaflet image assets
function petIcon(status: string, fed: boolean): DivIcon {
  const statusClass = (status || 'reported').replace(/[^a-z-]/g, '');
  const fedBadge = fed ? '<div class="fed">🍗</div>' : '';
  return L.divIcon({
    className: `pet-marker ${statusClass}`,
    html: `<div class="pin">🐾${fedBadge}</div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -28]
  });
}

export default function PetMap({ pets }: { pets: Pet[] }) {
  const markers = useMemo(() => pets.map(p => ({
    key: p.id,
    position: [p.lat, p.lng] as [number, number],
    icon: petIcon(p.status, p.fed),
    data: p
  })), [pets]);

  return (
    <MapContainer
      center={CALABRIA_CENTER}
      zoom={DEFAULT_ZOOM}
      minZoom={6}
      maxZoom={18}
      zoomControl={false}
      style={{ height: '100%', width: '100%', position: 'absolute' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {markers.map(m => (
        <Marker key={m.key} position={m.position} icon={m.icon}>
          <Popup>
            <div className="popup">
              <div className={`status-tag ${m.data.status}`}>{m.data.status}</div>
              <h3 className="popup-title">
                {m.data.type || 'Unknown'} — {m.data.locationName || 'Unknown spot'}
              </h3>
              <ul className="popup-list">
                <li><strong>Fed:</strong> {m.data.fed ? 'Yes' : 'No'}</li>
                {m.data.volunteer && <li><strong>Volunteer:</strong> {m.data.volunteer}</li>}
                {m.data.lastSeen && <li><strong>Last seen:</strong> {m.data.lastSeen}</li>}
                {m.data.notes && <li><strong>Notes:</strong> {m.data.notes}</li>}
              </ul>
              {m.data.contact && (
                <a className="btn" href={`tel:${m.data.contact}`}>Call rescuer</a>
              )}
            </div>
          </Popup>
        </Marker>
      ))}

      <ZoomControl position="bottomright" />
    </MapContainer>
  );
}
