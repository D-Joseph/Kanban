import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
  };
  
const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);

const auth = getAuth();
const provider = new GoogleAuthProvider();
const appSignIn = async() => {
    signInWithPopup(auth, provider)
  .then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    // The signed-in user info.
    const user = result.user;
    return user, token 
    // IdP data available using getAdditionalUserInfo(result)
    // ...
  }).catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    const email = error.customData.email;
    const credential = GoogleAuthProvider.credentialFromError(error);
    console.log("Error while intializing Firebase", errorCode, errorMessage, email, credential)
  })};


  const appSignOut = async() => {
    signOut(auth).then(() => {
      console.log("Successfully Signed Out");
    }).catch((error) => {
      console.log("Error while signing out", error.message)
    })
  }

  const db = getFirestore(app)

export { app, analytics, appSignIn, appSignOut, db };
