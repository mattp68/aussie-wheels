'use client';

import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { AustralianAddress, AustralianState } from '@/types/event';

export interface LocationSearchResult {
  type: 'venue' | 'street' | 'suburb' | 'state' | 'postcode';
  text: string;
  fullAddress: Partial<AustralianAddress>;
}

export async function searchLocations(searchTerm: string): Promise<LocationSearchResult[]> {
  if (!searchTerm || searchTerm.length < 2) return [];
  
  const locationsRef = collection(db, 'locations');
  const searchTermLower = searchTerm.toLowerCase();
  
  // Create queries for different fields
  const queries = [
    // Venue name search
    query(
      locationsRef,
      where('venueNameLower', '>=', searchTermLower),
      where('venueNameLower', '<=', searchTermLower + '\uf8ff'),
      orderBy('venueNameLower'),
      limit(3)
    ),
    // Street search
    query(
      locationsRef,
      where('streetLower', '>=', searchTermLower),
      where('streetLower', '<=', searchTermLower + '\uf8ff'),
      orderBy('streetLower'),
      limit(3)
    ),
    // Suburb search
    query(
      locationsRef,
      where('suburbLower', '>=', searchTermLower),
      where('suburbLower', '<=', searchTermLower + '\uf8ff'),
      orderBy('suburbLower'),
      limit(3)
    ),
    // Postcode search
    query(
      locationsRef,
      where('postcode', '>=', searchTerm),
      where('postcode', '<=', searchTerm + '\uf8ff'),
      limit(3)
    )
  ];

  try {
    // Execute all queries in parallel
    const querySnapshots = await Promise.all(queries.map(q => getDocs(q)));
    
    const results: LocationSearchResult[] = [];
    
    // Process venue results
    querySnapshots[0].forEach(doc => {
      const data = doc.data();
      if (data.venueName) {
        results.push({
          type: 'venue',
          text: `${data.venueName}`,
          fullAddress: {
            venueName: data.venueName,
            street: data.street,
            suburb: data.suburb,
            state: data.state as AustralianState,
            postcode: data.postcode
          }
        });
      }
    });

    // Process street results
    querySnapshots[1].forEach(doc => {
      const data = doc.data();
      if (data.street) {
        results.push({
          type: 'street',
          text: `${data.street}, ${data.suburb}`,
          fullAddress: {
            street: data.street,
            suburb: data.suburb,
            state: data.state as AustralianState,
            postcode: data.postcode
          }
        });
      }
    });

    // Process suburb results
    querySnapshots[2].forEach(doc => {
      const data = doc.data();
      if (data.suburb) {
        results.push({
          type: 'suburb',
          text: `${data.suburb}, ${data.state}`,
          fullAddress: {
            suburb: data.suburb,
            state: data.state as AustralianState,
            postcode: data.postcode
          }
        });
      }
    });

    // Process postcode results
    querySnapshots[3].forEach(doc => {
      const data = doc.data();
      if (data.postcode) {
        results.push({
          type: 'postcode',
          text: `${data.postcode} - ${data.suburb}, ${data.state}`,
          fullAddress: {
            suburb: data.suburb,
            state: data.state as AustralianState,
            postcode: data.postcode
          }
        });
      }
    });

    return results;
  } catch (error) {
    console.error('Error searching locations:', error);
    return [];
  }
} 