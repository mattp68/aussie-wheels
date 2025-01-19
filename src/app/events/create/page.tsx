'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { createEvent } from '@/services/eventService';
import { EventType, AustralianState } from '@/types/event';

export default function CreateEventPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    type: 'car' as EventType,
    date: '',
    time: '',
    location: {
      street: '',
      suburb: '',
      state: 'NSW' as AustralianState,
      postcode: '',
      venueName: '',
    },
    description: '',
    photos: [] as File[],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('location.')) {
      const locationField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          [locationField]: value,
        },
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData(prev => ({
        ...prev,
        photos: [...Array.from(e.target.files!)],
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('You must be logged in to create an event');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const eventId = await createEvent(formData, user.uid);
      router.push(`/events/${eventId}`); // Redirect to event details page instead of home
    } catch (err) {
      setError('Failed to create event. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Please log in to create an event</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow px-5 py-6 sm:px-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Event</h2>
          
          {error && (
            <div className="mb-4 bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Event Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                Event Type
              </label>
              <select
                name="type"
                id="type"
                required
                value={formData.type}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="car">Car Show</option>
                <option value="bike">Bike Show</option>
                <option value="boat">Boat Show</option>
                <option value="cruise">Cruise</option>
                <option value="meet up">Meet Up</option>
              </select>
            </div>

            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                Date
              </label>
              <input
                type="date"
                name="date"
                id="date"
                required
                value={formData.date}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                Time
              </label>
              <input
                type="time"
                name="time"
                id="time"
                required
                value={formData.time}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Location Details</h3>
              
              <div>
                <label htmlFor="location.venueName" className="block text-sm font-medium text-gray-700">
                  Venue Name (optional)
                </label>
                <input
                  type="text"
                  name="location.venueName"
                  id="location.venueName"
                  value={formData.location.venueName}
                  onChange={handleInputChange}
                  placeholder="e.g., Sydney Showground"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="location.street" className="block text-sm font-medium text-gray-700">
                  Street Address
                </label>
                <input
                  type="text"
                  name="location.street"
                  id="location.street"
                  required
                  value={formData.location.street}
                  onChange={handleInputChange}
                  placeholder="e.g., 1 Olympic Boulevard"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="location.suburb" className="block text-sm font-medium text-gray-700">
                  Suburb
                </label>
                <input
                  type="text"
                  name="location.suburb"
                  id="location.suburb"
                  required
                  value={formData.location.suburb}
                  onChange={handleInputChange}
                  placeholder="e.g., Sydney Olympic Park"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="location.state" className="block text-sm font-medium text-gray-700">
                    State
                  </label>
                  <select
                    name="location.state"
                    id="location.state"
                    required
                    value={formData.location.state}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="NSW">New South Wales</option>
                    <option value="VIC">Victoria</option>
                    <option value="QLD">Queensland</option>
                    <option value="WA">Western Australia</option>
                    <option value="SA">South Australia</option>
                    <option value="TAS">Tasmania</option>
                    <option value="ACT">Australian Capital Territory</option>
                    <option value="NT">Northern Territory</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="location.postcode" className="block text-sm font-medium text-gray-700">
                    Postcode
                  </label>
                  <input
                    type="text"
                    name="location.postcode"
                    id="location.postcode"
                    required
                    pattern="[0-9]{4}"
                    maxLength={4}
                    value={formData.location.postcode}
                    onChange={handleInputChange}
                    placeholder="e.g., 2127"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                id="description"
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Add any additional details about the event"
              />
            </div>

            <div>
              <label htmlFor="photos" className="block text-sm font-medium text-gray-700">
                Photos
              </label>
              <input
                type="file"
                name="photos"
                id="photos"
                multiple
                accept="image/*"
                onChange={handlePhotoChange}
                className="mt-1 block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Event'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 