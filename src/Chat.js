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
// import { Avatar } from '@mui/material'
import SendIcon from '@mui/icons-material/Send';
import { Avatar, Button, Modal, TextField } from '@mui/material';



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

  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [messageInput, setMessageInput] = useState('');

  console.log(selectedUser, user)

  const handleUserClick = user => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setSelectedUser(null);
    setModalOpen(false);
    setMessageInput('');
  };

  const handleSendMessage = async e => {
    e.preventDefault();
    if (messageInput) {
      const messageData = {
        senderId: user.uid,
        senderName: user.displayName,
        recipientId: selectedUser.id,
        recipientName: selectedUser.data.displayName,
        message: messageInput,
        timestamp: new Date().getTime(),
      };
      await db
        .collection('users')
        .doc(user.uid)
        .collection('messages')
        .add(messageData);
      // handleModalClose();
    setMessageInput('');
    }
  };

  const [userMessages, setUserMessages] = useState([]);
  const [sentMessages, setSentMessages] = useState([]);

  console.log(userMessages, sentMessages)

  useEffect(() => {
    // fetch messages from the Firestore database
    if (selectedUser) {
      const unsubscribe = db
        .collection("users")
        .doc(user.uid)
        .collection("messages")
        .orderBy("timestamp")
        .onSnapshot((snapshot) => {
          setSentMessages(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              data: doc.data(),
            }))
          );
        });

      // unsubscribe from the Firestore listener when the component unmounts
      return () => {
        unsubscribe();
      };
    }
  }, [selectedUser]);

  useEffect(() => {
    // fetch messages from the Firestore database
    if (selectedUser) {
      const unsubscribe = db
        .collection("users")
        .doc(selectedUser.id)
        .collection("messages")
        .orderBy("timestamp")
        .onSnapshot((snapshot) => {
          setUserMessages(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              data: doc.data(),
            }))
          );
        });

      // unsubscribe from the Firestore listener when the component unmounts
      return () => {
        unsubscribe();
      };
    }
  }, [selectedUser]);


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
                  <Button variant='contained' onClick={() => handleUserClick(user)}>Send Message</Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* message modal */}
        <Modal className='Modal' open={modalOpen} onClose={handleModalClose}>
          <div className='chat__messageModal'>
            <h3>Send a message to {selectedUser?.data?.displayName}</h3>
            <form onSubmit={handleSendMessage}>
              <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <div>
                  {/* display messages */}
                {userMessages.map((message) => (
                  <div style={{backgroundColor:' #1b1d1f', margin: '10px 0px', padding: '5px', borderRadius: '5px'}} key={message.id}>
                    {/* display sender's message on the right */}
                    {message.data.recipientId === user.uid && (
                      <div style={{ textAlign: "left" }}>
                        <p>{message.data.message}</p>
                        {/* <span>{message.data.timestamp}</span> */}
                      </div>
                    )}
                  </div>
                ))}
                </div>
                <div>
              {sentMessages.map((message) => (
                <div style={{backgroundColor:' #1b1d1f', margin: '10px 0px', padding: '5px', borderRadius: '5px'}} key={message.id}>
                  {/* display sender's message on the right */}
                  {message.data.senderId === user.uid && (
                    <div style={{ textAlign: "right" }}>
                      <p>{message.data.message}</p>
                      {/* <span>{message.data.timestamp}</span> */}
                    </div>
                  )}
                </div>
              ))}
              </div>
              </div>
              <div className='personalMsg'>
                <TextField
                  style={{marginRight: '10px'}}
                  variant='filled'
                  color="secondary"
                  placeholder='Type your message'
                  fullWidth
                  value={messageInput}
                  onChange={e => setMessageInput(e.target.value)}
                />
                <Button type='submit' variant='contained'>Send</Button>
              </div>
            </form>
          </div>
        </Modal>

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