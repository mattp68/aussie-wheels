'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getAllEvents } from '@/services/eventService';
import { Event, EventType } from '@/types/event';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import SearchBar from '@/components/SearchBar';

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedEventTypes, setSelectedEventTypes] = useState<EventType[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventData = await getAllEvents();
        setEvents(eventData);
        setFilteredEvents(eventData);
      } catch (err) {
        setError('Failed to load events');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    if (selectedEventTypes.length > 0) {
      setFilteredEvents(events.filter(event => selectedEventTypes.includes(event.type)));
    } else {
      setFilteredEvents(events);
    }
  }, [selectedEventTypes, events]);

  const handleEventTypeChange = (types: EventType[]) => {
    setSelectedEventTypes(types);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="pt-24 pb-8 px-4">
        <SearchBar onEventTypeChange={handleEventTypeChange} />
      </div>
      
      {/* Events Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="text-red-500 text-center mb-4">{error}</div>
        )}
        {filteredEvents.length === 0 ? (
          <div className="text-center text-gray-500">
            {selectedEventTypes.length > 0
              ? `No events found for selected types`
              : 'No events found'}
          </div>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <li key={event.id}>
                <Link href={`/events/${event.id}`} className="block">
                  <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                    {event.photos.length > 0 ? (
                      <div className="relative h-48 bg-gray-200">
                        <Image
                          src={event.photos[0]}
                          alt={event.name}
                          fill
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                    ) : (
                      <div className="h-48 bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400">No image</span>
                      </div>
                    )}
                    <div className="p-4">
                      <div className="uppercase tracking-wide text-sm text-blue-600 font-semibold">
                        {event.type}
                      </div>
                      <h3 className="mt-2 text-xl font-semibold text-gray-900">
                        {event.name}
                      </h3>
                      <div className="mt-2 text-gray-600">
                        {format(event.date, 'EEEE, MMMM d, yyyy')}
                      </div>
                      <div className="mt-1 text-gray-600">
                        {event.location.suburb}, {event.location.state}
                      </div>
                      <div className="mt-4 text-sm text-gray-500">
                        {event.attendees.length} attending
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
