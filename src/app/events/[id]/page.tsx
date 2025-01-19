'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getEvent, toggleAttendance } from '@/services/eventService';
import { Event } from '@/types/event';
import Image from 'next/image';
import { format } from 'date-fns';

export default function EventDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAttending, setIsAttending] = useState(false);
  const [attendanceLoading, setAttendanceLoading] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const eventData = await getEvent(params.id as string);
        if (!eventData) {
          setError('Event not found');
          return;
        }
        setEvent(eventData);
        setIsAttending(eventData.attendees.includes(user?.uid || ''));
      } catch (err) {
        setError('Failed to load event details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [params.id, user?.uid]);

  const handleAttendanceToggle = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    try {
      setAttendanceLoading(true);
      await toggleAttendance(params.id as string, user.uid);
      setIsAttending(!isAttending);
      
      // Update local event data
      if (event) {
        const updatedAttendees = isAttending
          ? event.attendees.filter(id => id !== user.uid)
          : [...event.attendees, user.uid];
        setEvent({ ...event, attendees: updatedAttendees });
      }
    } catch (err) {
      console.error('Failed to update attendance:', err);
    } finally {
      setAttendanceLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-600">{error || 'Event not found'}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Image Gallery */}
          {event.photos.length > 0 && (
            <div className="relative h-96 bg-gray-200">
              <Image
                src={event.photos[0]}
                alt={event.name}
                fill
                style={{ objectFit: 'cover' }}
                priority
              />
            </div>
          )}

          <div className="px-6 py-8">
            {/* Event Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{event.name}</h1>
              <div className="flex items-center text-gray-500 space-x-4">
                <span>{format(event.date, 'EEEE, MMMM d, yyyy')}</span>
                <span>•</span>
                <span>{event.time}</span>
                <span>•</span>
                <span className="capitalize">{event.type}</span>
              </div>
            </div>

            {/* Location Details */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Location</h2>
              <div className="text-gray-600">
                {event.location.venueName && (
                  <div className="font-medium">{event.location.venueName}</div>
                )}
                <div>{event.location.street}</div>
                <div>{event.location.suburb}</div>
                <div>{event.location.state} {event.location.postcode}</div>
              </div>
            </div>

            {/* Description */}
            {event.description && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">About this event</h2>
                <div className="text-gray-600 whitespace-pre-wrap">{event.description}</div>
              </div>
            )}

            {/* Attendance Section */}
            <div className="mt-8 border-t pt-8">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-500">
                    {event.attendees.length} {event.attendees.length === 1 ? 'person' : 'people'} attending
                  </div>
                </div>
                <button
                  onClick={handleAttendanceToggle}
                  disabled={attendanceLoading}
                  className={`px-6 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    isAttending
                      ? 'bg-red-100 text-red-700 hover:bg-red-200 focus:ring-red-500'
                      : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
                  }`}
                >
                  {attendanceLoading
                    ? 'Updating...'
                    : isAttending
                    ? 'Cancel Attendance'
                    : 'Attend Event'}
                </button>
              </div>
            </div>

            {/* Additional Images */}
            {event.photos.length > 1 && (
              <div className="mt-8 border-t pt-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Event Photos</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {event.photos.slice(1).map((photo, index) => (
                    <div key={index} className="relative aspect-square bg-gray-200 rounded-lg overflow-hidden">
                      <Image
                        src={photo}
                        alt={`${event.name} photo ${index + 2}`}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 