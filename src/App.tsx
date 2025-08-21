import { useEffect, useMemo, useRef, useState } from 'react';
import PetMap from './components/PetMap.tsx';
import { initialPets, Pet, PetStatus } from './pets.ts';
import './App.css';

const STATUSES: PetStatus[] = ['reported', 'in-progress', 'needs-medical', 'rescued'];

export default function App() {
  const [pets] = useState(initialPets);
  const [statusFilter, setStatusFilter] = useState(new Set(STATUSES));
  const [fedFilter, setFedFilter] = useState('any' as 'any' | 'fed' | 'not-fed');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return pets.filter(p => {
      const statusOK = statusFilter.has(p.status);
      const fedOK =
        fedFilter === 'any' ||
        (fedFilter === 'fed' && p.fed) ||
        (fedFilter === 'not-fed' && !p.fed);
      const searchOK =
        !term ||
        [p.type, p.status, p.notes, p.volunteer, p.locationName]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
          .includes(term);
      return statusOK && fedOK && searchOK;
    });
  }, [pets, statusFilter, fedFilter, search]);


  function Bar() {
    const inputRef = useRef(null);

    useEffect(() => {
      inputRef.current?.focus();
    }, []);

    return (
      <div className="bar">
        <div className="row">
          <label className="select">
            Fed status:
            <select value={fedFilter} onChange={e => setFedFilter(e.target.value as any)}>
              <option value="any">Any</option>
              <option value="fed">Fed</option>
              <option value="not-fed">Not fed</option>
            </select>
          </label>
        </div>


        <input
          ref={inputRef}
          className="search"
          placeholder="Search..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
    );
  }

  return (
    <div className="layout">

      <main className="map-wrap">
        <PetMap pets={filtered} />
        <Bar />
      </main>
    </div>
  );
}
