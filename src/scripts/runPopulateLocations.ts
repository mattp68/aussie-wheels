'use client';

import { populateLocations } from './populateLocations';

// Execute the script
populateLocations()
  .then(() => {
    console.log('Finished populating locations');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed to populate locations:', error);
    process.exit(1);
  }); 