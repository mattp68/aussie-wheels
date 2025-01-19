'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getAllEvents } from '@/services/eventService';
import { Event } from '@/types/event';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventData = await getAllEvents();
        setEvents(eventData);
      } catch (err) {
        setError('Failed to load events');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
              Aussie Wheels
            </h1>
            <p className="mt-4 text-xl text-gray-500">
              Discover automotive events across Australia
            </p>
            {user ? (
              <div className="mt-8">
                <button
                  onClick={() => router.push('/events/create')}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                >
                  Create Event
                </button>
              </div>
            ) : (
              <div className="mt-8 space-x-4">
                <Link
                  href="/login"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error && (
          <div className="text-center text-red-600 mb-8">{error}</div>
        )}
        
        {events.length === 0 ? (
          <div className="text-center text-gray-500 text-lg">
            No events found. Be the first to create one!
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <Link
                key={event.eventId}
                href={`/events/${event.eventId}`}
                className="block group"
              >
                <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
