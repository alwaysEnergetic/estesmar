import {initializeApp} from 'firebase/app';
import {
    createUserWithEmailAndPassword,
    getAuth,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signOut,
    updateProfile
} from 'firebase/auth';
import {collection, doc, getFirestore, setDoc} from 'firebase/firestore';
import {getDatabase} from 'firebase/database'


const config = {
    apiKey: process.env.REACT_APP_FIREBASE_API,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    databaseURL: process.env.REACT_APP_FIREBASE_DB_URL,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

initializeApp(config);

//export const googleProvider = new firebase.auth.GoogleAuthProvider();
export const firebaseAuth = getAuth;
export const firestore = getFirestore;
export const db = getDatabase();

export function loginWithGoogle() {
    //return firebaseAuth().signInWithRedirect(googleProvider);
}

export function auth(email, pw) {
    let username = localStorage.getItem("user");
    return createUserWithEmailAndPassword(firebaseAuth(), email, pw)
        .then(function(newUser) {
            setDoc(doc(collection(getFirestore(), "users"), newUser.user.uid), {
                email,
                username,
                funds: "100000",
                currentfunds: "100000",
                positions: "0",
                admin: false,
                watchlist: [],
            }).catch(function(error) {
                console.error("Error writing document: ", error);
            });
            return updateProfile(firebaseAuth().currentUser, {
                displayName: username,
            });
        })
        .then(user => {
            // Get the user's ID token and save it in the session cookie.
            return firebaseAuth().currentUser.getIdToken(true).then(function (token) {
                // set the __session cookie
                document.cookie = '__session=' + token + ';max-age=3600';
            })
        });
}

export function logout() {
    return signOut(firebaseAuth());
}

export function login(email, pw) {
    return signInWithEmailAndPassword(firebaseAuth(), email, pw).then(user => {
        // Get the user's ID token and save it in the session cookie.
        return firebaseAuth().currentUser.getIdToken(true).then(function (token) {
            // set the __session cookie
            document.cookie = '__session=' + token + ';max-age=3600';
        })
    });
}

export function resetPassword(email) {
    return sendPasswordResetEmail(firebaseAuth(), email);
}
