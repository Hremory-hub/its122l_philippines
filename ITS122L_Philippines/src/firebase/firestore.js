import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './config';

// Get all documents from a collection
export const getCollection = async (collectionName) => {
  const snapshot = await getDocs(collection(db, collectionName));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Add a new document
export const addDocument = async (collectionName, data) => {
  return await addDoc(collection(db, collectionName), {
    ...data,
    createdAt: serverTimestamp()
  });
};

// Update a document
export const updateDocument = async (collectionName, id, data) => {
  const ref = doc(db, collectionName, id);
  return await updateDoc(ref, data);
};

// Delete a document
export const deleteDocument = async (collectionName, id) => {
  const ref = doc(db, collectionName, id);
  return await deleteDoc(ref);
};