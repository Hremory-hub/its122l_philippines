# 🌿 Dfarm Resort — Booking Website

A full-stack resort booking web application built with **React + Vite** and **Firebase** (Authentication + Firestore).

---

## 📋 Prerequisites

Make sure you have the following installed before getting started:

- [Node.js](https://nodejs.org/) v18 or higher
- npm (comes with Node.js)
- A [Firebase](https://console.firebase.google.com/) account

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Firebase

You need to connect the app to your own Firebase project.

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use an existing one)
3. Enable **Authentication** → Sign-in method → **Email/Password**
4. Create a **Firestore Database** (start in test mode or use the rules below)
5. Go to **Project Settings** → **Your apps** → Add a Web App
6. Copy the Firebase config object

### 4. Add your Firebase config

Open `src/firebase/config.js` and replace the config values with your own:

```js
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🔐 Setting Up an Admin Account

Admin access is role-based and controlled via Firestore.

1. **Register** a new account on the website
2. Go to **Firebase Console → Firestore Database → `users` collection**
3. Find the document with your User UID (visible in **Authentication → Users**)
4. Edit the document and set:
   - Field: `role`
   - Type: `string`
   - Value: `admin`
5. Sign out and sign back in — the Admin link will appear in the navbar

> ⚠️ Make sure the value is exactly `admin` with no extra spaces or newlines.

---

## 🗂️ Project Structure

```
src/
├── assets/               ← Room and resort images
├── data/
│   └── rooms.js          ← Central room data (used across all pages)
├── firebase/
│   ├── config.js         ← Firebase initialization
│   ├── AuthContext.jsx   ← Auth state provider
│   ├── auth.js           ← Auth helper functions
│   └── firestore.js      ← Firestore helper functions
├── components/
│   └── navbar.jsx        ← Site-wide navigation bar
└── pages/
    ├── Home.jsx           ← Landing page
    ├── About.jsx          ← About the resort
    ├── Gallery.jsx        ← Photo gallery
    ├── Contact.jsx        ← Contact form
    ├── Announcements.jsx  ← Public announcements feed
    ├── Testimonials.jsx   ← Guest reviews
    ├── Bookings.jsx       ← Guest booking page (protected)
    ├── Profile.jsx        ← Account settings (protected)
    ├── Admin.jsx          ← Admin dashboard (admin only)
    └── Login.jsx          ← Login / Register
```

---

## 🔥 Firestore Collections

| Collection | Description |
|---|---|
| `users` | Stores user profile and role (`guest` or `admin`) |
| `bookings` | Guest reservation records |
| `announcements` | Admin-created announcements shown publicly |
| `rooms` | Room listings manageable from the admin panel |
| `testimonials` | Guest reviews submitted via the Reviews page |
| `contacts` | Messages submitted via the Contact form |

---

## 🔒 Firestore Security Rules

Paste these rules in **Firebase Console → Firestore → Rules**:

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    match /users/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
      allow read: if request.auth != null &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    match /bookings/{id} {
      allow read, write: if request.auth != null;
    }

    match /rooms/{id} {
      allow read: if true;
      allow write: if request.auth != null &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    match /announcements/{id} {
      allow read: if true;
      allow write: if request.auth != null &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    match /testimonials/{id} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    match /contacts/{id} {
      allow write: if true;
      allow read: if request.auth != null &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

---

## 📦 Build for Production

```bash
npm run build
```

The output will be in the `dist/` folder. You can deploy it to Firebase Hosting, Vercel, or Netlify.

---

## 🛠️ Tech Stack

- **React 18** + **Vite**
- **Firebase** — Authentication & Firestore
- **React Router v6**
- **CSS-in-JS** (inline styles)

---

## 👥 Contributors

- Raphael Gigante