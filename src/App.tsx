import { useEffect, useMemo, useRef, useState } from 'react';
import PetMap from './components/PetMap.tsx';
import LoginForm from './loginForm.tsx';
import { initialPets, Pet, PetStatus } from './pets.ts';
import './App.css';

const STATUSES: PetStatus[] = ['reported', 'in-progress', 'needs-medical', 'rescued'];

export default function App() {
const [pets] = useState(initialPets);
const [statusFilter, setStatusFilter] = useState(new Set(STATUSES));
const [fedFilter, setFedFilter] = useState('any' as 'any' | 'fed' | 'not-fed');
const [onlyNeedsMedical, setOnlyNeedsMedical] = useState(false);
const [barVisibility, setBarVisibiility] = useState(true);
const [search, setSearch] = useState('');
const [user, setUser] = useState(null);

const filtered = useMemo(() => {
  const term = search.trim().toLowerCase();
  return pets.filter(p => {
    const statusOK = statusFilter.has(p.status);
    const fedOK =
      fedFilter === 'any' ||
      (fedFilter === 'fed' && p.fed) ||
      (fedFilter === 'not-fed' && !p.fed);

    const healthOK = !onlyNeedsMedical || p.status === 'needs-medical'; 

    const searchOK =
      !term ||
      [p.type, p.status, p.notes, p.volunteer, p.locationName]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(term);

    return statusOK && fedOK && healthOK && searchOK;
  });
}, [pets, statusFilter, fedFilter, onlyNeedsMedical, search]);

  function Bar() {
    const inputRef = useRef(null);

    useEffect(() => {
      inputRef.current?.focus();
    }, []);

    return ((barVisibility && (
      <div className="bar">
        <div className="row">
          <fieldset className="group">
            <legend>Status</legend>
            {STATUSES.map(s => (
              <label key={s} className="option">
                <input
                  type="checkbox"
                  checked={statusFilter.has(s)}
                  onChange={e => {
                    const next = new Set(statusFilter);
                    if (e.target.checked) next.add(s);
                    else next.delete(s);
                    setStatusFilter(next);
                  }}
                />
                {s}
              </label>
            ))}
          </fieldset>
        </div>

        <div className="row">
          <fieldset className="group">
            <legend>Fed status</legend>
            {[
              { value: 'any', label: 'Tutti' },
              { value: 'fed', label: 'Fed' },
              { value: 'not-fed', label: 'Not fed' },
            ].map(opt => (
              <label key={opt.value} className="option">
                <input
                  id = {`fed-${opt.value}`}
                  type="radio"
                  name="fed"
                  value={opt.value}
                  checked={fedFilter === opt.value}
                  onChange={() => setFedFilter(opt.value as any)}
                />
                {opt.label}
              </label>
            ))}
          </fieldset>
        </div>

        <input
          id="search"
          ref={inputRef}
          className="search"
          placeholder="Search..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
    )));
  }

  function LateralBar() {
    return (
      <div className={`lateralbar ${barVisibility ? 'visible' : 'hidden'}`}>
        <button className="toggle-button" onClick={() => setBarVisibiility(!barVisibility)}>
          {barVisibility ? '<<' : '>>'}
        </button>
        {barVisibility && (
          <div className="content">
            <h2>Filters</h2>
            <div className="filter-group">
              <label>
                <input
                  type="checkbox"
                  checked={onlyNeedsMedical}
                  onChange={e => setOnlyNeedsMedical(e.target.checked)}
                />
                Only needs medical attention
              </label>
            </div>
          </div>
        )}
      </div>
    );
  }

 const [currentPosition, setCurrentPosition] = useState<[number, number]>([39.0, 16.25]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const coords: [number, number] = [position.coords.latitude, position.coords.longitude];
      setCurrentPosition(coords);
    });
  }, []);

  return (
    <>
    {user ? (
        <div className="layout">
          <main className="map-wrap">
            <PetMap pets={filtered} current_position={currentPosition} />
            <Bar />

          </main>
        </div>
      ) : (
        <LoginForm setuser={setUser}/>
      )}
  </>
  );
}
