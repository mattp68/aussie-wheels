import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  getDoc,
  getDocs,
  query,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { Event, EventFormData } from '@/types/event';

export const createEvent = async (eventData: EventFormData, userId: string): Promise<string> => {
  try {
    // Upload photos first
    const photoUrls = await Promise.all(
      eventData.photos.map(async (photo: File) => {
        const storageRef = ref(storage, `events/${userId}/${Date.now()}-${photo.name}`);
        const snapshot = await uploadBytes(storageRef, photo);
        return getDownloadURL(snapshot.ref);
      })
    );

    // Convert date and time strings to Firestore timestamp
    const [year, month, day] = eventData.date.split('-').map(Number);
    const [hours, minutes] = eventData.time.split(':').map(Number);
    const eventDate = new Date(year, month - 1, day, hours, minutes);
    
    // Create event document
    const eventRef = await addDoc(collection(db, 'events'), {
      ...eventData,
      date: Timestamp.fromDate(eventDate),
      photos: photoUrls,
      createdBy: userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      attendees: [],
    });

    return eventRef.id;
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
};

export const updateEvent = async (
  eventId: string,
  eventData: Partial<EventFormData>,
  existingEvent: Event
): Promise<void> => {
  try {
    const eventRef = doc(db, 'events', eventId);

    // Handle photo updates if there are new photos
    let photoUrls = existingEvent.photos;
    if (eventData.photos && eventData.photos.length > 0) {
      const newPhotoUrls = await Promise.all(
        eventData.photos.map(async (photo: File) => {
          const storageRef = ref(storage, `events/${existingEvent.createdBy}/${Date.now()}-${photo.name}`);
          const snapshot = await uploadBytes(storageRef, photo);
          return getDownloadURL(snapshot.ref);
        })
      );
      photoUrls = [...photoUrls, ...newPhotoUrls];
    }

    await updateDoc(eventRef, {
      ...eventData,
      photos: photoUrls,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating event:', error);
    throw error;
  }
};

export const deleteEvent = async (eventId: string, userId: string): Promise<void> => {
  try {
    const eventRef = doc(db, 'events', eventId);
    const eventSnap = await getDoc(eventRef);
    
    if (!eventSnap.exists()) {
      throw new Error('Event not found');
    }

    const eventData = eventSnap.data() as Event;
    
    // Check if user is the creator
    if (eventData.createdBy !== userId) {
      throw new Error('Unauthorized to delete this event');
    }

    // Delete photos from storage
    await Promise.all(
      eventData.photos.map(async (photoUrl) => {
        const photoRef = ref(storage, photoUrl);
        try {
          await deleteObject(photoRef);
        } catch (error) {
          console.error('Error deleting photo:', error);
        }
      })
    );

    // Delete event document
    await deleteDoc(eventRef);
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
};

export const toggleAttendance = async (eventId: string, userId: string): Promise<void> => {
  try {
    const eventRef = doc(db, 'events', eventId);
    const eventSnap = await getDoc(eventRef);
    
    if (!eventSnap.exists()) {
      throw new Error('Event not found');
    }

    const eventData = eventSnap.data();
    const attendees = eventData.attendees || [];
    
    // Toggle attendance
    const isAttending = attendees.includes(userId);
    const updatedAttendees = isAttending
      ? attendees.filter((id: string) => id !== userId)
      : [...attendees, userId];

    // Only update the attendees array and updatedAt timestamp
    await updateDoc(eventRef, {
      attendees: updatedAttendees,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error toggling attendance:', error);
    throw error;
  }
};

export const getEvent = async (eventId: string): Promise<Event | null> => {
  try {
    const eventRef = doc(db, 'events', eventId);
    const eventSnap = await getDoc(eventRef);
    
    if (!eventSnap.exists()) {
      return null;
    }

    const eventData = eventSnap.data();
    return {
      id: eventSnap.id,
      ...eventData,
      date: eventData.date instanceof Timestamp ? eventData.date.toDate() : new Date(eventData.date),
      createdAt: eventData.createdAt?.toDate() || new Date(),
      updatedAt: eventData.updatedAt?.toDate() || new Date(),
    } as Event;
  } catch (error) {
    console.error('Error fetching event:', error);
    throw error;
  }
};

export const getAllEvents = async (): Promise<Event[]> => {
  try {
    const eventsRef = collection(db, 'events');
    const q = query(eventsRef, orderBy('date', 'asc')); // Order by date ascending
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date instanceof Timestamp ? doc.data().date.toDate() : new Date(doc.data().date),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as Event[];
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
}; 