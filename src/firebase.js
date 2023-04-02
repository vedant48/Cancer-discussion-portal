import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import {getStorage} from 'firebase/storage';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCN-CV1I1yhxVc-xsKi5_nycnWIYLDVfAk",
  authDomain: "cancer-portal-7e00a.firebaseapp.com",
  projectId: "cancer-portal-7e00a",
  storageBucket: "cancer-portal-7e00a.appspot.com",
  messagingSenderId: "37898810712",
  appId: "1:37898810712:web:f61efd0a0394449c54a12d",
  measurementId: "G-XFCBMXST82"
};

  const firebaseApp = firebase.initializeApp(firebaseConfig);
  const db = firebaseApp.firestore();
  const auth = firebase.auth();
  const provider = new firebase.auth.GoogleAuthProvider();
  export const storage = getStorage(firebaseApp)

  export { auth, provider };
  export default db;
