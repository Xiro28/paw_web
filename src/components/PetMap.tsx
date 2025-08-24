import { MapContainer, TileLayer, Marker, Popup, ZoomControl, Pane, SVGOverlay, useMap } from 'react-leaflet';
import L, { DivIcon, LatLngExpression, LatLngBounds } from 'leaflet';
import { useEffect, useMemo, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import type { Pet } from '../pets';
import geoCoordCalabria from '../json/calabria.json'; // local GeoJSON


// World polygon with Calabria as a hole to darken outside
const world: LatLngExpression[][] = [[
    [-90, -180], [-90, 180], [90, 180], [90, -180]
]];

const polys = (Array.isArray((geoCoordCalabria as any).features)
    ? (geoCoordCalabria as any).features[0].geometry.coordinates
    : (geoCoordCalabria as any).geometry.coordinates) as number[][][][];
const calabriaHoles: LatLngExpression[][] = polys.map(ring =>
    ring[0].map(([lng, lat]) => [lat, lng])
);

const calabria_bounds =  L.geoJSON(geoCoordCalabria as any, {
            style: { color: '#fff', weight: 1, fillOpacity: 0 } // outline only
        });

const mask_polygon = L.polygon([...world, ...calabriaHoles], {
    stroke: false,
    fillColor: 'black',
    fillOpacity: 0.75
})

function petIcon(status: string, fed: boolean): DivIcon {
    const statusClass = (status || 'reported').replace(/[^a-z-]/g, '');
    const fedBadge = fed ? '🍗' : '🐾';
    return L.divIcon({
        className: `pet-marker ${statusClass}`,
        html: `<div class="pin">${fedBadge}</div>`,
        iconSize: [48, 48],
        iconAnchor: [18, 36],
        popupAnchor: [0, -28]
    });
}

function useCalabriaBounds() {
    const [bounds, setBounds] = useState<LatLngBounds | null>(null);
    useEffect(() => {
        // compute bounds from local GeoJSON without adding a layer
        const tmp = L.geoJSON(geoCoordCalabria as any);
        const b = tmp.getBounds();
        setBounds(b);
        tmp.remove(); // cleanup temp layer
    }, []);
    return bounds;
}

function Recenter({ position }: { position: [number, number] | null }) {
  const map = useMap();
  const [used, setUsed] = useState(false);

  useEffect(() => {
    if (position && !used) {
      map.flyTo(position, 14);
      setUsed(true); // mark as used -> prevents further runs
    }
  }, [position, map, used]);

  if (used) return null; // self-destruct after first use
  return null;
}


function CalabriaMask() {
    const map = useMap();

    useEffect(() => {
        let outsideMask: L.Polygon | null = null;
        let calabriaLayer: L.GeoJSON | null = null;

        // Draw Calabria outline/fill + outside mask (purely visual)
        calabriaLayer = calabria_bounds.addTo(map);

        const bounds = calabriaLayer.getBounds();
        map.fitBounds(bounds);
        map.setMaxBounds(bounds.pad(0.2)); // keep camera near Calabria

        outsideMask = mask_polygon.addTo(map);

        return () => {
            outsideMask?.remove();
            calabriaLayer?.remove();
        };
    }, [map]);

    return null;
}

export default function PetMap({ pets, current_position }: { pets: Pet[], current_position: [number, number] | null }) {
    const markers = useMemo(() => pets.map(p => ({
        key: p.id,
        position: [p.lat, p.lng] as [number, number],
        icon: petIcon(p.status, p.fed),
        data: p
    })), [pets]);

    const calabriaBounds = useCalabriaBounds(); // used to limit tile requests


    return (
        <MapContainer
            center={current_position} // fallback to Calabria center if not loaded
            zoom={13}
            minZoom={10}
            maxZoom={18}
            fadeAnimation={false}
            zoomControl={false}
            style={{ height: '100%', width: '100%', position: 'absolute' }}
            worldCopyJump={false}
            preferCanvas={false}
        >
            {calabriaBounds && (
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    bounds={calabriaBounds}   // <-- key: clamp tile requests to Calabria bbox
                    noWrap                    // prevent world repeats
                    detectRetina
                    updateWhenIdle
                />
            )}

            {/* Visual mask + spotlight */}
            <CalabriaMask />

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
                            <div className="pin_bar">
                                {m.data.contact && (
                                    <a className="btn" href={`tel:${m.data.contact}`}>
                                        <div className="telefone">📞
                                            <p>Veterinario</p>
                                        </div>
                                    </a>
                                )}
                                { !m.data.fed &&
                                    (<a className="btn">
                                    <div className="telefone">🍽
                                        <p>Sfama</p>
                                    </div>
                                </a>)}

                                <a className="btn" href={'https://www.google.com/maps?q=' + m.data.lat + ',' + m.data.lng} target="_blank" rel="noreferrer">
                                    <div className="telefone">📍
                                        <p>Indicazioni</p>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </Popup>
                </Marker>
            ))}

            <ZoomControl position="bottomright" />
        </MapContainer>
    );
}
