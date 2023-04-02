import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './App.css';
import Chat from './Chat';
import Sidebar from './Sidebar';
import { selectUser } from './features/userSlice';
import Login from './Login';
import { login, logout } from './features/userSlice';
import db, { auth } from './firebase';


function App() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  useEffect(() => {
    const uns = auth.onAuthStateChanged((authUser) => {
      if(authUser) {
        dispatch(login({
          uid: authUser.uid,
          photo: authUser.photoURL,
          email: authUser.email,
          displayName: authUser.displayName,
          role: ""
        }))

        db.collection('users').doc(authUser.uid).set({
          photo: authUser.photoURL,
          uid: authUser.uid,
          email: authUser.email,
          role: "",
          displayName: authUser.displayName,
        });
        
        //user is loged in
      }else {
        //useris loged out
        dispatch(logout());
      }
    })
    return uns;
  }, [dispatch])

  
  return (
    <div className="app">
      {user ? (
        <>
        <Sidebar />
        <Chat />
        </>
      ):(
        <Login />
      )}
      
    </div>
  );
}

export default App;
