import { AddCircle, CardGiftcard, EmojiEmotions, Gif } from '@mui/icons-material'
import React, { useEffect, useState, useRef } from 'react'
import "react-tooltip/dist/react-tooltip.css";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { useSelector } from 'react-redux'
import './Chat.css'
import ChatHeader from './ChatHeader'
import { selectChannelId, selectChannelName, selectChannelType } from './features/appSlice'
import { selectUser } from './features/userSlice'
import Message from './Message'
import db, { storage } from './firebase'
import firebase from 'firebase/compat/app';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { v4 } from 'uuid'
import { Avatar } from '@mui/material'
import SendIcon from '@mui/icons-material/Send';


function Chat() {
  const channelId = useSelector(selectChannelId)
  const user = useSelector(selectUser)
  const channelName = useSelector(selectChannelName)
  const channelType = useSelector(selectChannelType)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([])
  const [imageUpload, setImageUpload] = useState(null)
  const [users, setUsers] = useState([]);
  const [showUsers, setShowUsers] = useState(false);
  const messagesEndRef = useRef(null);


  const handleShowUsers = () => {
    setShowUsers(true);
  };

  const handleHideUsers = () => {
    setShowUsers(false);
  };


  useEffect(() => {
    const unsubscribe = db.collection("users").onSnapshot((snapshot) => {
      const users = snapshot.docs.map((doc) => ({
        id: doc.id,
        data: doc.data(),
      }));
      setUsers(users);
    });

    return () => {
      unsubscribe();
    };
  }, []);


  useEffect(() => {
    if (channelId) {
      db.collection("channels")
        .doc(channelId)
        .collection("messages")
        .orderBy("timeStamp", "asc")
        .onSnapshot((snapshot) =>
          setMessages(
            snapshot.docs.map((doc) => ({ id: doc.id, messages: doc.data() }))
          )
        );
    }
  }, [channelId]);

  const handleKeyDown = (e) => {
    if (e.keyCode === 13 && !e.shiftKey) {
      e.preventDefault();
      // Call a function to send the message
      sendMessage();
    }
  };

  const sendMessage = async () => {
    if (!input) {
      return;
    }
    let imageUrl = '';
    if (image) {
      const storageRef = ref(storage, `images/${v4()}`);
      const snapshot = await uploadBytes(storageRef, image);
      imageUrl = await getDownloadURL(snapshot.ref);
    }

    db.collection('channels').doc(channelId).collection('messages').add({
      timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
      message: input,
      imageUrl: imageUrl,
      user: user,
    })

    setInput('')
    setImage(null);
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  const [image, setImage] = useState(null);
  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };
  const handleNewline = (e) => {
    if (e.keyCode === 13) {
      setInput((prevInput) => prevInput + '\n')
    }
  }

  const textAreaRef = useRef(null);

  useEffect(() => {
    const textArea = textAreaRef.current;
    textArea.style.height = 'auto';
    textArea.style.height = `${textArea.scrollHeight}px`;

    const adjustHeight = () => {
      textArea.style.height = 'auto';
      textArea.style.height = `${textArea.scrollHeight}px`;
    };

    textArea.addEventListener('input', adjustHeight);
    return () => textArea.removeEventListener('input', adjustHeight);
  }, []);

  console.log(channelName, channelType, messages)

  return (
    <>
    <div className='chat'>
      <ChatHeader channelName={channelName} handleHideUsers={handleHideUsers} handleShowUsers={handleShowUsers} />

      {showUsers && (
        <div className="chatHeader__usersModel">
          {users.map((user) => (
            <div className="sidebar__profile" key={user.id}>
              <Avatar src={user.data.photo} />
              <div className="sidebar__profileInfo">
                <h3>{user.data.displayName}</h3>
                <p>{user.data.email}</p>
                <h6>{user.data.role}</h6>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="chat__messages">
        {/* {console.log(messages)} */}
        {messages.map(({ id, messages }) => (
          <Message
            key={id}
            id={id}
            message={messages.message}
            timestamp={messages.timeStamp}
            messageUser={messages.user}
            imageUrl={messages.imageUrl}
            email={messages.user.email}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat__input">
        <form>
          {image && ( // Show image preview if an image is selected
            <div className='chat__imagePreview'>
              <img style={{ width: "100px" }} src={URL.createObjectURL(image)} alt='Preview' />
              <span style={{ cursor: "pointer" }} onClick={() => setImage(null)}>x</span>
            </div>
          )}
          <textarea value={input}
            disabled={!channelId || channelType === 'noEdit'}
            ref={textAreaRef}
            onChange={(e) => {
              setInput(e.target.value)
            }}
            onKeyDown={handleKeyDown}
            placeholder={`Message #${channelName}`} rows="1"></textarea>
          {/* <input value = {input}
            disabled={!channelId}
            onChange={(e) => {
              setInput(e.target.value)
            }}
            placeholder={`Message #${channelName}`}
          /> */}
          
        </form>
        <div className="chat__inputIcons">
          <CardGiftcard />
          <label id="app-title">
            <input style={{ display: 'none' }} type='file' onChange={handleImageChange} />
            <AddCircle />
          </label>
          <button
            disabled={!channelId || (!input && !image)}
            className='chat__inputButton'
            type='submit'
            onClick={sendMessage}
          >
            <SendIcon />
          </button>
        </div>
      </div>
    </div>
    <ReactTooltip
        anchorId="app-title"
        place="bottom"
        content="Click to select a image"
      />
    </>
  )
}

export default Chat