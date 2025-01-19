'use client';

import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { AustralianState } from '@/types/event';

interface LocationDocument {
  venueName?: string;
  venueNameLower?: string;
  street: string;
  streetLower: string;
  suburb: string;
  suburbLower: string;
  state: AustralianState;
  postcode: string;
}

const sampleLocations: LocationDocument[] = [
  {
    venueName: 'Sydney Opera House',
    venueNameLower: 'sydney opera house',
    street: '2 Macquarie Street',
    streetLower: '2 macquarie street',
    suburb: 'Sydney',
    suburbLower: 'sydney',
    state: 'NSW',
    postcode: '2000'
  },
  {
    venueName: 'Melbourne Cricket Ground',
    venueNameLower: 'melbourne cricket ground',
    street: 'Brunton Avenue',
    streetLower: 'brunton avenue',
    suburb: 'Richmond',
    suburbLower: 'richmond',
    state: 'VIC',
    postcode: '3002'
  },
  {
    street: '12 Adelaide Street',
    streetLower: '12 adelaide street',
    suburb: 'Brisbane',
    suburbLower: 'brisbane',
    state: 'QLD',
    postcode: '4000'
  },
  {
    street: '45 Murray Street',
    streetLower: '45 murray street',
    suburb: 'Perth',
    suburbLower: 'perth',
    state: 'WA',
    postcode: '6000'
  },
  {
    venueName: 'Adelaide Oval',
    venueNameLower: 'adelaide oval',
    street: 'War Memorial Drive',
    streetLower: 'war memorial drive',
    suburb: 'North Adelaide',
    suburbLower: 'north adelaide',
    state: 'SA',
    postcode: '5006'
  }
];

export async function populateLocations() {
  try {
    const locationsRef = collection(db, 'locations');
    
    for (const location of sampleLocations) {
      await addDoc(locationsRef, location);
      console.log(`Added location: ${location.street}, ${location.suburb}`);
    }
    
    console.log('Successfully populated locations collection');
  } catch (error) {
    console.error('Error populating locations:', error);
    throw error;
  }
} 