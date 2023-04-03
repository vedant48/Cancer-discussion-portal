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
import "react-tooltip/dist/react-tooltip.css";
import { Tooltip as ReactTooltip } from "react-tooltip";

function ChatHeader({ channelName, handleHideUsers, handleShowUsers }) {
  
  return (
    <>
    <div className='chatHeader'>
      <div className="chatHeader__left">
        <h3><span className='chatHeader__hash'>#</span>{channelName}</h3>


      </div>

      <div className="chatHeader__right">
        <NotificationsIcon />
        {/* <EditLocationIcon /> */}
        <PeopleAltIcon id="app-title1"
          onDoubleClick={handleShowUsers}
          onClick={handleHideUsers}
        />
        {/* <div className="chatHeader__search">
          <input placeholder='Search' />
          <SearchIcon />
        </div> */}

        {/* <SendIcon /> */}
        <HelpIcon id="app-title4" />
        <ReactTooltip
        anchorId="app-title4"
        place="bottom"
        content="Double click on message to delete"
      />
          <ExitToAppIcon className="chatHeader__ExitAppIcon" id="app-title2" style={{ color: "#808080" }} onClick={() => auth.signOut()} />
      </div>
    </div>
    <ReactTooltip
        anchorId="app-title1"
        place="bottom"
        content="Double click to show users and single click to hide"
      />
      <ReactTooltip
        anchorId="app-title2"
        place="bottom"
        content="Wanna logout?"
      />
    </>
  )
}

export default ChatHeader