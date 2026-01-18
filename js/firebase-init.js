// js/firebase-init.js
// Configuração oficial do Firebase para o Ministério Zoe Maringá

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  onAuthStateChanged, 
  signOut 
} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  collection,
  addDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-storage.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-analytics.js";

// ✅ Configuração oficial do Firebase - Zoe Platform
const firebaseConfig = {
  apiKey: "AIzaSyCG9aNE_1oa70pGw0hK5Fw9d-FoV7Spdog",
  authDomain: "zoeplatform-1c4f1.firebaseapp.com",
  projectId: "zoeplatform-1c4f1",
  storageBucket: "zoeplatform-1c4f1.firebasestorage.app",
  messagingSenderId: "829598907952",
  appId: "1:829598907952:web:27de54354fabe7810eb7f5",
  measurementId: "G-EDVSHBDK4R"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);

// Configurar Google Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('profile');
googleProvider.addScope('email');

// Exportar todos os módulos necessários
export { 
  auth, 
  googleProvider, 
  signInWithPopup, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  onAuthStateChanged, 
  signOut, 
  db, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  collection,
  addDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
  storage,
  ref,
  uploadBytes,
  getDownloadURL,
  analytics
};

// Log de inicialização
console.log('✅ Firebase Zoe Platform inicializado com sucesso!');
console.log('📍 Projeto:', firebaseConfig.projectId);
console.log('🔐 Auth Domain:', firebaseConfig.authDomain);
