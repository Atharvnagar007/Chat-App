import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, updateDoc, arrayRemove } from "firebase/firestore";
import { getStorage, ref, deleteObject } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDLXnF1soNMX5LehoVmspHRctVP_H9HX60",
  authDomain: "app-11-9ed6e.firebaseapp.com",
  projectId: "app-11-9ed6e",
  storageBucket: "app-11-9ed6e.appspot.com",
  messagingSenderId: "103481423935",
  appId: "1:103481423935:web:7abdf2198b03abbbc1608a"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore();
export const storage = getStorage();

export const deleteMessage = async (chatId, message) => {
  const chatRef = doc(db, "chats", chatId);
  await updateDoc(chatRef, {
    messages: arrayRemove(message),
  });

  // Delete associated file from storage if it exists
  if (message.img || message.audio) {
    const fileUrl = message.img || message.audio;
    const fileRef = ref(storage, fileUrl);

    try {
      await deleteObject(fileRef);
      console.log("File deleted successfully");
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  }
};
