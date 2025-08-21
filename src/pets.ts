export type PetStatus = 'reported' | 'in-progress' | 'needs-medical' | 'rescued';

export type Pet = {
  id: string;
  type: 'Dog' | 'Cat' | string;
  status: PetStatus;
  fed: boolean;
  lat: number;
  lng: number;
  locationName?: string;
  lastSeen?: string;     // YYYY-MM-DD
  volunteer?: string;
  notes?: string;
  contact?: string;      // phone
};

export const initialPets: Pet[] = [
  {
    id: 'cs-001',
    type: 'Dog',
    status: 'reported',
    fed: false,
    lat: 38.907,
    lng: 16.588,
    locationName: 'Cosenza – Centro',
    lastSeen: '2025-08-18',
    volunteer: 'Giulia R.',
    notes: 'Skittish but approachable with treats.'
  },
  {
    id: 'rc-002',
    type: 'Cat',
    status: 'needs-medical',
    fed: true,
    lat: 38.111,
    lng: 15.650,
    locationName: 'Reggio Calabria – Lungomare',
    lastSeen: '2025-08-20',
    volunteer: 'Marco P.',
    notes: 'Limping on rear leg; vet visit advised.',
    contact: '+39 333 000000'
  },
  {
    id: 'cz-003',
    type: 'Dog',
    status: 'in-progress',
    fed: true,
    lat: 38.905,
    lng: 16.598,
    locationName: 'Catanzaro – Parco della Biodiversità',
    lastSeen: '2025-08-21',
    volunteer: 'Sofia L.',
    notes: 'Wearing red collar, friendly.'
  },
  {
    id: 'kr-004',
    type: 'Cat',
    status: 'rescued',
    fed: true,
    lat: 39.083,
    lng: 17.127,
    locationName: 'Crotone – Centro Storico',
    lastSeen: '2025-08-17',
    volunteer: 'Associazione Zampa',
    notes: 'Taken to shelter for adoption.'
  },
  {
    id: 'vv-005',
    type: 'Dog',
    status: 'reported',
    fed: false,
    lat: 38.676,
    lng: 16.100,
    locationName: 'Vibo Valentia – Porto',
    lastSeen: '2025-08-19',
    volunteer: 'Alessio M.',
    notes: 'Barks at strangers; avoid direct approach.'
  }
];
