// Import the functions you need from the SDKs you need
import {initializeApp} from "firebase/app";
import {getAnalytics} from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {connectFunctionsEmulator, getFunctions, httpsCallable} from "firebase/functions";
import {getAuth, GoogleAuthProvider, signInWithPopup} from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCVjRKS0WeLA_fnynwNi_drATF-e3obPRs",
    authDomain: "gotcha-game.firebaseapp.com",
    projectId: "gotcha-game",
    storageBucket: "gotcha-game.appspot.com",
    messagingSenderId: "256024212174",
    appId: "1:256024212174:web:311f96879a83db86d4d69f",
    measurementId: "G-3BKQPBWZBK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Auth
const provider = new GoogleAuthProvider();
const auth = getAuth();

// Initialize Functions
const functions = getFunctions();

/**
 * Sign in with Google, updates the UI, and queries the target of the current user.
 */
document.getElementById("signIn").onclick = function signIn() {
    signInWithPopup(auth, provider).then(result => {
        const name = result.user.displayName;
        document.getElementById("name").innerHTML += name;
        document.getElementById("signIn").style.visibility = "hidden";
        document.getElementById("name").style.visibility = "visible";
        document.getElementById("alive").style.visibility = "visible";
        document.getElementById("target").style.visibility = "visible";
        queryAndHandleTarget();
    });
}

/**
 * Queries the target of the current user and updates the UI.
 */
function queryAndHandleTarget() {
    const queryTarget = httpsCallable(functions, "queryTarget");
    queryTarget().then(result => {
        if (result === null || result.data === null) {
            console.log("query target result is null");
            return;
        }
        // @ts-ignore
        handleTarget(result.data.email, result.data.targetEmail, result.data.alive, result.data.targetName)
    }).catch(error => {
        console.log(error);
    });
}

function handleTarget(email: string, targetEmail: string, alive: boolean, targetName: string) {
    if (email === targetEmail) {
        document.getElementById("alive").innerHTML = "Congrats!"
        document.getElementById("target").innerHTML = "You are the last player alive.";
    } else {
        // @ts-ignore
        document.getElementById("alive").innerHTML += alive ? "alive" : "unalive";
        // @ts-ignore
        document.getElementById("target").innerHTML += targetName;
    }
}