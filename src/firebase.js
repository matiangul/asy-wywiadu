// This import loads the firebase namespace along with all its type information.
import * as firebase from "firebase/app";

// These imports load individual services into the firebase namespace.
import "firebase/auth";
import "firebase/analytics";
import "firebase/database";

let app = null;

if (firebase.apps.length > 0) {
  app = firebase.apps[0];
} else {
  app = firebase.initializeApp({
    apiKey: "AIzaSyB8hMpCCmpLt9EIuOTG0f1oRYXV28B7QqU",
    authDomain: "asy-wywiadu.firebaseapp.com",
    databaseURL: "https://asy-wywiadu.firebaseio.com",
    projectId: "asy-wywiadu",
    storageBucket: "asy-wywiadu.appspot.com",
    messagingSenderId: "906845334929",
    appId: "1:906845334929:web:a8a39cd9d05c80d4363e30",
    measurementId: "G-WREW8047ZL",
  });
}

// var gameRef = firebase.database().ref("/game/1");
// gameRef.on("value", function (gameSnapshot) {
//   console.log("listener", gameSnapshot.val());
// });

// remember to off listeners

export default app;
