import React, { useState, useEffect } from 'react'
import './ChatHeader.css'
import NotificationsIcon from '@mui/icons-material/Notifications';
import EditLocationIcon from '@mui/icons-material/EditLocation';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import SearchIcon from '@mui/icons-material/Search';
import SendIcon from '@mui/icons-material/Send';
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { IconButton } from "@mui/material";
import HelpIcon from '@mui/icons-material/Help';
import db, { auth } from './firebase';

function ChatHeader({ channelName, handleHideUsers, handleShowUsers }) {
  
  return (
    <div className='chatHeader'>
      <div className="chatHeader__left">
        <h3><span className='chatHeader__hash'>#</span>{channelName}</h3>


      </div>

      <div className="chatHeader__right">
        <NotificationsIcon />
        {/* <EditLocationIcon /> */}
        <PeopleAltIcon
          onDoubleClick={handleShowUsers}
          onClick={handleHideUsers}
        />
        <div className="chatHeader__search">
          <input placeholder='Search' />
          <SearchIcon />
        </div>

        {/* <SendIcon /> */}
        {/* <HelpIcon /> */}
        <IconButton style={{ color: "#808080" }} onClick={() => auth.signOut()}>
          <ExitToAppIcon className="chatHeader__ExitAppIcon" />
        </IconButton>
      </div>
    </div>
  )
}

export default ChatHeader