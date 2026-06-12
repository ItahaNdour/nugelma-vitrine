import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc
} from "firebase/firestore";
import fs from "fs";

const firebaseConfig = {
  apiKey: "AIzaSyAsvo_BLwZcB_eyYXABDp7SKuI7JZBOgkc",
  authDomain: "nugelma-new-version.firebaseapp.com",
  projectId: "nugelma-new-version",
  storageBucket: "nugelma-new-version.firebasestorage.app",
  messagingSenderId: "412518422474",
  appId: "1:412518422474:web:7dcba1da90c5e223a12133"
};

const CLEAR_EXISTING_PRODUCTS = false;

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function clearProducts(){
  const snapshot = await getDocs(collection(db, "products"));

  for(const item of snapshot.docs){
    await deleteDoc(doc(db, "products", item.id));
    console.log("Supprimé :", item.id);
  }
}

async function importProducts(){
  const raw = fs.readFileSync("./products_import.json", "utf-8");
  const products = JSON.parse(raw);

  if(CLEAR_EXISTING_PRODUCTS){
    console.log("Suppression des produits existants...");
    await clearProducts();
  }

  for(const product of products){
    await addDoc(collection(db, "products"), product);
    console.log("Importé :", product.nom);
  }

  console.log(`Import terminé : ${products.length} produits.`);
}

importProducts().catch((error)=>{
  console.error("Erreur import :", error);
  process.exit(1);
});
