// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCS9fiK5_38SxhmGvV3Nx4BoKE95hWC4gs",
  authDomain: "eflare-34fdf.firebaseapp.com",
  projectId: "eflare-34fdf",
  storageBucket: "eflare-34fdf.appspot.com",
  messagingSenderId: "747585945529",
  appId: "1:747585945529:web:a67020ea85d548413fc068",
  measurementId: "G-FRRQ4RM60E"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

