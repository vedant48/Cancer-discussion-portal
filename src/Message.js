import React, { useState } from "react";
import "./Message.css";
import { Avatar } from "@mui/material";
import { useSelector } from 'react-redux';
import { selectUser } from './features/userSlice';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import db from "./firebase";
import { selectChannelId } from "./features/appSlice";
import "react-tooltip/dist/react-tooltip.css";
import { Tooltip as ReactTooltip } from "react-tooltip";

const Messages = ({ message, timestamp, imageUrl, messageUser, email, id }) => {

  const channelId = useSelector(selectChannelId)
  const user = useSelector(selectUser)
  const [showDelete, setShowDelete] = useState(false);

  const boldAndItalicMessage = message
    .split("**")
    .map((text, index) => {
      if (index % 2 === 1) {
        return <strong key={index}>{text}</strong>;
      }
      return text;
    })
    .map((text, index) => {
      if (typeof text === "string") {
        return text.split("~").map((text, index) => {
          if (index % 2 === 1) {
            return <i key={index}>{text}</i>;
          }
          return text;
        });
      }
      return text;
    });

  const messageWithBreaks = boldAndItalicMessage
    .flat()
    .reduce((prev, curr, index) => {
      if (typeof curr === "string") {
        const lines = curr.split("\n");
        lines.forEach((line, i) => {
          prev.push(line);
          if (i < lines.length - 1) {
            prev.push(<br key={`${index}-${i}`} />);
          }
        });
      } else {
        prev.push(curr);
      }
      return prev;
    }, []);

    const handleDoubleClick = () => {
      if (user?.email === email || user.uid === "53Dk3X5vmETYIXWmi1s3LnBtx1i2") {
        setShowDelete(true);
      }
    }

    console.log(user.email)
  
    const handleDeleteClick = (e) => {
      e.stopPropagation();
      db.collection("channels")
        .doc(channelId)
        .collection("messages")
        .doc(id)
        .delete()
        .then(() => {
          setShowDelete(false);
        })
        .catch((error) => {
          console.error("Error removing document: ", error);
        });
    }

  return (
    <div className="message" onDoubleClick={handleDoubleClick} onMouseLeave={() => setShowDelete(false)}    >
      <Avatar src={messageUser.photo} />
      <div className="message__info">
        <h4>
          {messageUser.displayName}
          <span className="message__timestamp">
            {new Date(timestamp?.toDate()).toLocaleString()}
          </span>
        </h4>
        {imageUrl && (
          <img
            src={imageUrl}
            alt="uploaded"
            style={{ maxWidth: "300px" }}
          />
        )}
        <p>{messageWithBreaks}</p>
        {showDelete && (
          <span className="delete__message" onClick={handleDeleteClick}>
            <DeleteIcon />
          </span>
        )}
      </div>
    </div>
  );
};

export default Messages;
