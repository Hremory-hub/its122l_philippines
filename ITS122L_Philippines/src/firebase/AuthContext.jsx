import { createContext, useContext, useEffect, useState } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './config';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  const register = async (email, password) => {
    console.log('1. register called');
    const result = await createUserWithEmailAndPassword(auth, email, password);
    console.log('2. user created:', result.user.uid);

    await setDoc(doc(db, 'users', result.user.uid), {
      email: result.user.email,
      role: 'guest',
      createdAt: serverTimestamp()
    });
    console.log('3. firestore write done ✅');
    return result;
  };

  const googleLogin = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    await setDoc(doc(db, 'users', result.user.uid), {
      email: result.user.email,
      name: result.user.displayName,
      role: 'guest',
      createdAt: serverTimestamp()
    }, { merge: true });
    return result;
  };

  const logout = () => signOut(auth);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      console.log('auth state:', firebaseUser?.email ?? 'not logged in');
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // ✅ now exports 'user' not 'currentUser'
  return (
    <AuthContext.Provider value={{ user, loading, login, register, googleLogin, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};