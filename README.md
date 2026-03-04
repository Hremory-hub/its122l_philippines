# Dfarm Resort — Website Structure & Integration Guide

## 📁 File Structure
```
dfarm-resort/
├── index.html          ← Main landing page (home)
├── bookings.html       ← Guest: view & manage own bookings
├── admin.html          ← Admin: dashboard & manage all bookings
└── README.md           ← This file
```

## 🔥 Firebase Integration (JavaScript SDK)

### 1. Create Firebase Project
1. Go to https://console.firebase.google.com
2. Create a new project: "dfarm-resort"
3. Enable **Authentication** (Email/Password + Google)
4. Create a **Firestore Database**

### 2. Add Firebase Config to each HTML file
Paste this before `</body>` in every HTML file:
```html
<script type="module">
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
  import { getFirestore } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
  import { getAuth } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";

 const firebaseConfig = {
  apiKey: "AIzaSyCOfV-HqrKezlOpyXOHbqrmras5xR2bYFY",
  authDomain: "dfarm-its122l-philippines.firebaseapp.com",
  projectId: "dfarm-its122l-philippines",
  storageBucket: "dfarm-its122l-philippines.firebasestorage.app",
  messagingSenderId: "447633086709",
  appId: "1:447633086709:web:ab63ebcaab0ee205840dbc",
  measurementId: "G-2RN1HTZKN3"
};

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const auth = getAuth(app);
</script>
```

### 3. Firestore Collections
```
users/
  {uid}/
    name, email, phone, role (guest|admin)

bookings/
  {bookingId}/
    guestId, guestName, guestEmail
    roomType, checkIn, checkOut, guests
    totalAmount, status (pending|confirmed|cancelled|completed)
    createdAt, specialRequests

rooms/
  {roomId}/
    name, type, pricePerNight, capacity, features, available

services/
  {serviceId}/
    name, description, price, available

announcements/
  {annId}/
    title, body, tag, date, imageUrl
```

### 4. Save a Booking (JavaScript)
Replace `submitBooking()` function with:
```javascript
import { addDoc, collection, serverTimestamp } from "firebase-firestore";

async function submitBooking() {
  const booking = {
    guestName: document.querySelector('[name=firstName]').value + ' ' + document.querySelector('[name=lastName]').value,
    checkIn: document.querySelector('[name=checkin]').value,
    checkOut: document.querySelector('[name=checkout]').value,
    roomType: document.querySelector('[name=roomType]').value,
    guests: document.querySelector('[name=guests]').value,
    status: 'pending',
    createdAt: serverTimestamp()
  };
  await addDoc(collection(db, 'bookings'), booking);
  showToast('✅ Reservation submitted!');
}
```

---

## 🐘 PHP Backend (Optional API Layer)

If you want PHP to handle server-side logic, create these files:

### `api/booking.php`
```php
<?php
session_start();
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require 'vendor/autoload.php'; // Firebase PHP Admin SDK

use Kreait\Firebase\Factory;

$factory = (new Factory)->withServiceAccount('service-account.json');
$db = $factory->createFirestore()->database();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $bookingsRef = $db->collection('bookings');
    $newBooking = $bookingsRef->add([
        'guestName'    => $data['guestName'],
        'guestEmail'   => $data['guestEmail'],
        'roomType'     => $data['roomType'],
        'checkIn'      => $data['checkIn'],
        'checkOut'     => $data['checkOut'],
        'guests'       => $data['guests'],
        'specialRequests' => $data['specialRequests'] ?? '',
        'status'       => 'pending',
        'createdAt'    => new \Google\Cloud\Core\Timestamp(new \DateTime())
    ]);
    
    echo json_encode(['success' => true, 'id' => $newBooking->id()]);
}
?>
```

### `api/auth.php`
```php
<?php
session_start();

// Verify Firebase ID token server-side
$idToken = $_POST['idToken'] ?? '';
$factory = (new Factory)->withServiceAccount('service-account.json');
$auth = $factory->createAuth();

try {
    $verifiedToken = $auth->verifyIdToken($idToken);
    $uid = $verifiedToken->claims()->get('sub');
    $_SESSION['uid'] = $uid;
    $_SESSION['role'] = $verifiedToken->claims()->get('role') ?? 'guest';
    echo json_encode(['success' => true]);
} catch (Exception $e) {
    echo json_encode(['error' => 'Invalid token']);
}
?>
```

### Install PHP Firebase SDK
```bash
composer require kreait/firebase-php
```

---

## 🔐 Security Rules (Firestore)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /bookings/{bookingId} {
      allow read: if request.auth != null && 
        (request.auth.uid == resource.data.guestId || 
         request.auth.token.role == 'admin');
      allow create: if request.auth != null;
      allow update, delete: if request.auth.token.role == 'admin';
    }
    match /rooms/{roomId} {
      allow read: if true;
      allow write: if request.auth.token.role == 'admin';
    }
    match /announcements/{annId} {
      allow read: if true;
      allow write: if request.auth.token.role == 'admin';
    }
  }
}
```

## 🚀 React.js Setup (for your Vite project)
Copy the HTML files' structure into React components:
```
src/
  components/
    Navbar.jsx
    Hero.jsx
    BookingModal.jsx
    RoomCard.jsx
  pages/
    Home.jsx
    Bookings.jsx
    Admin.jsx
  firebase/
    config.js    ← Firebase initialization
    auth.js      ← Auth functions
    firestore.js ← DB functions
```