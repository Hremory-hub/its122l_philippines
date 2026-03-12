import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './firebase/AuthContext';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase/config';
import Home from './pages/Home';
import Bookings from './pages/Bookings';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Navbar from './components/navbar';
import Profile from './pages/Profile';
import Testimonials from './pages/Testimonials';
import About from './pages/About';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';

const Layout = ({ children }) => (
  <>
    <Navbar />
    <main>{children}</main>
  </>
);

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <div style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'100vh' }}><p>Loading...</p></div>;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(null);
  const [checking, setChecking] = useState(true);
  const location = useLocation();

  useEffect(() => {
    if (loading) return;
    if (!user) { setChecking(false); return; }
    const check = async () => {
      try {
        const snap = await getDoc(doc(db, 'users', user.uid));
        console.log('UID:', user.uid);
        console.log('Doc exists:', snap.exists());
        console.log('Data:', snap.data());
        console.log('Role:', snap.data()?.role);
        setIsAdmin(snap.exists() && snap.data().role?.trim() === 'admin');
      } catch (e) {
        console.error('Admin check failed:', e);
        setIsAdmin(false);
      } finally {
        setChecking(false);
      }
    };
    check();
  }, [user, loading]);

  if (loading || checking) return <div style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'100vh' }}><p>Loading...</p></div>;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Layout><Home /></Layout>} />
      <Route path="/bookings" element={<ProtectedRoute><Layout><Bookings /></Layout></ProtectedRoute>} />
      <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Layout><Profile /></Layout></ProtectedRoute>} />
      <Route path="/testimonials" element={<Layout><Testimonials /></Layout>} />
      <Route path="/about" element={<Layout><About /></Layout>} />
      <Route path="/gallery" element={<Layout><Gallery /></Layout>} />
      <Route path="/contact" element={<Layout><Contact /></Layout>} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;