export type EventType = 'car' | 'bike' | 'boat' | 'cruise' | 'meet up';

export type AustralianState = 'NSW' | 'VIC' | 'QLD' | 'WA' | 'SA' | 'TAS' | 'ACT' | 'NT';

export interface AustralianAddress {
  street: string;
  suburb: string;
  state: AustralianState;
  postcode: string;
  venueName?: string;
}

export interface Event {
  id: string;
  name: string;
  type: EventType;
  date: Date;
  time: string;
  location: AustralianAddress;
  description?: string;
  photos: string[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  attendees: string[];
}

export type EventFormData = {
  name: string;
  type: EventType;
  date: string;
  time: string;
  location: AustralianAddress;
  description?: string;
  photos: File[];
}; 