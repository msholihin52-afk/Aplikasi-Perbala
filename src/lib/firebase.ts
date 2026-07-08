import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCTP9LH7Kpq2HS4oVBOknuJQXZcDqZJCtg",
  authDomain: "gen-lang-client-0753400819.firebaseapp.com",
  projectId: "gen-lang-client-0753400819",
  storageBucket: "gen-lang-client-0753400819.firebasestorage.app",
  messagingSenderId: "1052583076129",
  appId: "1:1052583076129:web:220a32e2dc372cdd4c5e60"
};

const app = initializeApp(firebaseConfig);

// Initialize Firestore with the specific custom database ID
export const db = getFirestore(app, "ai-studio-monitoringperbal-b058dd99-1148-4e02-8b24-ef6a30254c73");
