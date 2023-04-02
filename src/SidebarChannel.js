import React from 'react'
import { useDispatch } from 'react-redux'
import { setChannelInfo } from './features/appSlice'
import "./SidebarChannel.css"


function SidebarChannel({id, channelName, channelType}) {
  const dispatch = useDispatch();

  return (
    <div
    className='sidebarChannel' 
      onClick= {() => 
        dispatch(
          setChannelInfo({
            channelId: id.id,
            channelName: channelName,
            channelType: channelType
          })
        )
      }
    >
        <h4><span className='sidebarChannel__hash' >#</span>{channelName}</h4>
    </div>
  )
}

export default SidebarChannel