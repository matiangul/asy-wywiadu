// This import loads the firebase namespace along with all its type information.
import * as firebase from 'firebase/app';

// These imports load individual services into the firebase namespace.
import 'firebase/auth';
import 'firebase/analytics';
import 'firebase/database';
import 'firebase/firestore';

let app: firebase.app.App = null;

if (firebase.apps.length > 0) {
  app = firebase.apps[0];
} else {
  app = firebase.initializeApp({
    apiKey: 'AIzaSyB8hMpCCmpLt9EIuOTG0f1oRYXV28B7QqU',
    authDomain: 'asy-wywiadu.firebaseapp.com',
    databaseURL: 'https://asy-wywiadu-europe.europe-west1.firebasedatabase.app',
    projectId: 'asy-wywiadu',
    storageBucket: 'asy-wywiadu.appspot.com',
    messagingSenderId: '906845334929',
    appId: '1:906845334929:web:a8a39cd9d05c80d4363e30',
    measurementId: 'G-WREW8047ZL',
  });
}

export default app;
