Below is an **updated** requirements document reflecting the **new requirement** for users to indicate they will attend an event. All changes are highlighted in the relevant sections for clarity.

---

## **1\. Project Overview**

### **1.1 Introduction**

Aussie Wheels is a web application that allows users to find and share information about car, bike, boat, cruise, and meetup events across all Australian states. It provides a platform for event organizers (or any user) to create, edit, and delete events, while also enabling attendees to search for events by location, date, and event type. **Additionally, authenticated users can mark themselves as “attending” an event.**

### **1.2 Goals and Objectives**

* **Primary Goal**: To provide a centralized, user-friendly platform where enthusiasts can discover and share upcoming automotive (and related) events in Australia.  
* **Secondary Goals**:  
  * Offer a modern and intuitive UI/UX for easy event discovery and management.  
  * Allow secure user authentication and profile management via Firebase.  
  * Implement robust searching and filtering by date, location, and type of event.  
  * **Allow authenticated users to indicate their attendance (RSVP) to specific events.**  
  * Ensure images can be uploaded and displayed for each event.  
  * Support editing and deletion of events by their creators.

---

## **2\. Scope of Work**

1. **User Authentication**

   * Users can register and log in using Firebase Authentication.  
2. **Event Creation and Management**

   * Authenticated users can create a new event by providing the mandatory fields (event name, type, date, time, location).  
   * Event creator can upload photos for each event.  
   * Event creator can edit or delete their event.  
3. **Event Discovery**

   * Search for events by:  
     1. Location (e.g., city name, state, or address).  
     2. Date or date range.  
     3. Type of event (car, bike, boat, cruise, meet up).  
   * Browse events in a list (or possibly on a map, if desired in future enhancements).  
4. **Attendance (New Requirement)**

   * **Authenticated users** can mark themselves as “attending” an event.  
   * **Unauthenticated users** who click the “Attend” option are prompted to log in or sign up before they can confirm attendance.  
   * Display how many users are attending each event (optional enhancement).  
5. **Responsive Design**

   * The web application must be fully responsive (desktop, tablet, and mobile).

---

## **3\. User Roles and Permissions**

1. **Anonymous Users**

   * Can view public events.  
   * Can search, filter, and read event details.  
   * **Can see the option to “Attend” an event but must sign up or log in to confirm attendance.**  
2. **Authenticated Users**

   * Can do everything an anonymous user can do.  
   * Can create, edit, and delete events **they** created.  
   * Can upload event images for events **they** created.  
   * **Can mark themselves as “attending” any event.**  
3. **Admins (Optional extension)**

   * If you need advanced management, an Admin role can be introduced:  
     * View, edit, or delete any user’s event.  
     * Manage user accounts (block, approve).

---

## **4\. Functional Requirements**

### **4.1 User Authentication**

1. **Sign Up**

   * Users can sign up using email and password (handled by Firebase).  
   * Validation for valid email address, strong password, etc.  
2. **Login**

   * Users can log in with the registered credentials.  
   * Keep user session active until they log out or the session expires.  
3. **Logout**

   * Users can log out of their session.  
4. **Profile Management** (Optional extension)

   * Users can optionally update their profile (name, profile picture).

### **4.2 Event Management**

1. **Create Event**

   * Input fields (required):  
     * Event Name (string)  
     * Event Type (enum: `car`, `bike`, `boat`, `cruise`, `meet up`)  
     * Date (date picker)  
     * Time (time picker or text input)  
     * Location (Australian address string or a geocoded location)  
   * Optional fields:  
     * Description / Additional Info (string \- if needed)  
   * Photos (multiple images if desired):  
     * Stored in Firebase Storage (or similar).  
     * Event document in the database stores links to images.  
2. **Edit Event**

   * Only the event creator can edit the event.  
   * Must be able to edit all fields (name, type, date, time, location, images).  
3. **Delete Event**

   * Only the event creator can delete the event (and associated images).

### **4.3 Event Search and Filter**

1. **Filter by Location**

   * Users enter a location query (e.g., “Sydney”, “Melbourne”, “Perth”) or a specific address.  
   * The application retrieves events located within that query.  
   * (Optional advanced feature: radius-based searching using geolocation.)  
2. **Filter by Date**

   * Users can select a single date or a date range to find relevant events.  
3. **Filter by Type**

   * Users can select one or multiple event types (car, bike, boat, cruise, meet up) to narrow down results.  
4. **Search Results**

   * Display event cards with key details (title, date/time, location, thumbnail image).  
   * Provide a link or button to view full event details.

### **4.4 Event Details View**

* Show all details of the event: name, date/time, location, type, any extra description, and a gallery of images.  
* Show the name of the user who created it (optional).  
* **Show the “Attend” button (or RSVP button).**  
  * If the user is **authenticated**, clicking “Attend” toggles the user’s attendance status.  
  * If the user is **anonymous**, clicking “Attend” prompts them to log in or sign up.  
* **(Optional enhancement)** Show the list or count of users who are attending.

### **4.5 Attendance** 

1. **Attend Button**

   * Only authenticated users can confirm attendance.  
   * If a user is not logged in, show a modal or popup prompting them to log in or sign up.  
2. **Data Persistence**

   * Once an authenticated user clicks “Attend,” store the user’s ID in an `attendees` array (or subcollection) on the event document.  
   * **Optional**: Provide a way for users to “unattend” or remove themselves from the attendance list if they can no longer attend.  
3. **Display Attendee Count**

   * A simple label showing “X people attending” or a list of attending users (if privacy is not a concern).

---

## **5\. Non-Functional Requirements**

1. **Performance**

   * The web app should load in under 2 seconds on standard broadband.  
   * Efficient query filtering (use Firestore indexes if needed).  
2. **Scalability**

   * Use Firebase services (Firestore, Firebase Storage, etc.) for automatic scalability.  
3. **Security**

   * All user data must be stored securely.  
   * Authentication and Firestore database rules to ensure only authorized access.  
   * Protect file uploads (only authenticated users can upload).  
4. **Usability**

   * Minimal steps for event creation and attendance.  
   * Responsive design for mobile, tablet, and desktop.  
5. **Maintainability**

   * Code should be modular, well-documented, and adhere to modern best practices.  
   * Use version control (Git) to track changes.  
6. **Reliability / Availability**

   * Ensure 99.9% uptime by using Firebase Hosting or similar robust hosting platforms.  
   * Data redundancy handled by Firestore.

---

## **6\. Technical Stack**

1. **Front-End**

   * **Cursor** (as your IDE / environment).  
   * **React.js** or **Next.js** for building a responsive SPA (Single Page Application).  
   * UI Library (Material UI, Tailwind, or Bootstrap).  
2. **Back-End / Server-Side**

   * Primarily managed by **Firebase** (no traditional server needed unless you want custom APIs with Firebase Cloud Functions).  
   * **Firebase Authentication** to handle user login/sign up.  
   * **Firebase Firestore** (or Realtime Database) for storing event data, including attendance.  
   * **Firebase Storage** to handle image uploads.  
3. **Deployment**

   * **Firebase Hosting** for deploying the front end.  
   * Alternatively, deploy to Vercel / Netlify if preferred.  
4. **Additional Services**

   * **Cloud Functions** (optional) if you need server-side logic (e.g., automated notifications or advanced geolocation queries).

---

## **7\. Data Model**

Below is a **revised** entity-relationship approach, including the `attendees` field.

### **7.1 Users Collection**

| Field | Type | Description |
| ----- | ----- | ----- |
| **userId** | String | Unique identifier (provided by Firebase Auth). |
| **displayName** | String | The display name of the user. |
| **email** | String | User’s email (unique in Firebase Auth). |
| **profilePicture** | String | URL to the user’s profile picture in Firebase Storage (optional). |
| **createdAt** | Timestamp | Date/time when the user record was created. |

### **7.2 Events Collection**

| Field | Type | Description |
| ----- | ----- | ----- |
| **eventId** | String | Auto-generated unique ID. |
| **name** | String | The name of the event (e.g., “Sydney Classic Car Show”). |
| **type** | String (enum) | One of “car”, “bike”, “boat”, “cruise”, “meet up”. |
| **date** | Date | The date of the event (Firebase Timestamp or ISO string). |
| **time** | String or Time | The time of the event. |
| **location** | String | Address or geocoded location. If you want geospatial queries, store latitude/longitude in separate fields. |
| **createdBy** | String | **userId** of the user who created the event. |
| **photos** | Array of Strings | Each string is a URL to an uploaded image in Firebase Storage. |
| **attendees** | Array of Strings | **New**. Each string is a `userId` referencing an authenticated user who marked attendance. |
| **createdAt** | Timestamp | Timestamp when this event was created. |
| **updatedAt** | Timestamp | Timestamp when this event was last updated. |

* **Attendance** can also be stored in a subcollection, e.g., `events/{eventId}/attendees/{attendeeId}`, if you prefer.  
* If you just need a simple “Attending” count and a basic list, an array of `userId`s is sufficient.  
* If you anticipate large numbers of attendees per event (thousands+), a subcollection is more scalable.

---

## **8\. Application Flow and Wireframe Overview**

1. **Landing/Home Page**

   * Hero section with a search bar (location, date, type).  
   * Quick links to featured or upcoming events.  
2. **Search / Results Page**

   * List of events based on user’s filter criteria.  
   * Each event card: name, date, time, location, thumbnail image, and a brief snippet.  
   * A button or link to **“View Details.”**  
3. **Event Details Page**

   * Full details of the event (name, date/time, location, type, images).  
   * **“Attend” button** to mark the user as attending. If user not logged in, show a prompt to log in/sign up.  
   * If the user already clicked “Attend,” show an “Unattend” or “Cancel Attendance” option (optional).  
4. **Create / Edit Event Page**

   * Form with the required fields.  
   * Drag-and-drop or file input for images.  
   * Save or cancel button.  
5. **Login / Signup Page**

   * Basic Firebase email/password fields and “forgot password” (optional).  
6. **Profile Page (Optional)**

   * Display user info and possibly list of events they have created.  
   * Could also display events they’re attending (optional extension).

---

## **9\. Security and Permissions**

1. **Firebase Security Rules**  
   * Only authenticated users can write to the **Events** collection (create, edit, delete).  
   * Users can only edit/delete documents in **Events** where `createdBy == userId`.  
   * **Attendance**: only an authenticated user can add their userId to an event’s `attendees` array/subcollection.  
2. **Data Validation**  
   * Validate data types (date, time, type) in Firestore rules or on the client side.  
3. **Image Uploads**  
   * Use Firebase Storage security rules: only allow authenticated users to upload.  
   * Possibly store images in a path like `/events/{eventId}/photos/{photoId}`.

---

## **10\. Testing Strategy**

1. **Unit Testing**

   * Test individual components (forms, attendance functionality, etc.).  
   * If using React, use Jest \+ React Testing Library.  
2. **Integration Testing**

   * Firebase integration for authentication and data queries.  
   * Confirm that attendance toggling works (adding/removing user from `attendees`).  
3. **User Acceptance Testing (UAT)**

   * Have real users test the flow of creating, editing, searching, and attending events.

---

## **11\. Project Milestones (High-Level)**

1. **Project Setup**

   * Configure Firebase project (Auth, Firestore, Storage).  
   * Set up the front-end scaffold (React \+ routing).  
2. **Authentication Module**

   * Build login and registration pages.  
   * Integrate Firebase Auth and handle user sessions.  
3. **Event Management**

   * Create event creation form.  
   * Integrate Firebase Firestore for event storage.  
   * Implement image uploads to Firebase Storage.  
   * Implement edit and delete functionality with security rules.  
4. **Attendance Feature**

   * Implement “Attend” button logic.  
   * Store attendance in Firestore (array or subcollection).  
   * Handle toggling of attendance and authentication prompts.  
5. **Search & Filter**

   * Implement location, date, and type filtering.  
   * Optimize Firestore queries or set up indexes for performance.  
6. **UI/UX Design & Responsive Layout**

   * Style the application.  
   * Ensure responsiveness on different devices.  
7. **Testing & QA**

   * Unit, integration, and acceptance testing.  
8. **Deployment**

   * Deploy to Firebase Hosting.  
   * Final verification and bug fixes.

---

## **12\. Design Considerations**

1. **Branding**

   * Use a color palette reflecting the automotive theme or Aussie aesthetic.  
   * Keep the design consistent and visually appealing.  
2. **Navigation**

   * Primary navigation to switch between Home, Events, Create Event, and User Profile.  
   * Consider a fixed top navbar or hamburger menu on mobile.  
3. **Event Cards**

   * Prominent images, event name, date/time, location, short summary.  
   * Clear call to action to view details and attend.  
4. **Responsive Layout**

   * Grid-based layout for event cards on desktop.  
   * Single-column or vertical scrolling for mobile.  
5. **Attendance Indicator**

   * Show an “Attend” or “I’m Going” button on the event card or details page.  
   * If the user is already attending, display a confirmation or “Attending” label.

---

// Import the functions you need from the SDKs you need  
import { initializeApp } from "firebase/app";  
import { getAnalytics } from "firebase/analytics";  
// TODO: Add SDKs for Firebase products that you want to use  
// https://firebase.google.com/docs/web/setup\#available-libraries

// Your web app's Firebase configuration  
// For Firebase JS SDK v7.20.0 and later, measurementId is optional  
const firebaseConfig \= {  
  apiKey: "AIzaSyDp9I-Wir\_4rrIOhqTsJNyMlb0pqxZUj2c",  
  authDomain: "aussie-wheels.firebaseapp.com",  
  projectId: "aussie-wheels",  
  storageBucket: "aussie-wheels.firebasestorage.app",  
  messagingSenderId: "221216924023",  
  appId: "1:221216924023:web:26f14cdea7284fd7804172",  
  measurementId: "G-VC7QP3CW3G"  
};

// Initialize Firebase  
const app \= initializeApp(firebaseConfig);  
const analytics \= getAnalytics(app);  
