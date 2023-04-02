import React, { useEffect, useState } from 'react'
import "./Sidebar.css"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import SidebarChannel from './SidebarChannel';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import MicIcon from '@mui/icons-material/Mic';
import SettingsIcon from '@mui/icons-material/Settings';
import { InfoOutlined, Call, Headset } from '@mui/icons-material';
import { Avatar } from '@mui/material';
import { useSelector } from 'react-redux';
import { selectUser } from './features/userSlice';
import db, { auth } from './firebase';



function Sidebar() {
    const user = useSelector(selectUser);
    // console.log(user);

    const [channels, setChannels] = useState([]);
    const [users, setUsers] = useState([]);
    const [showChannels, setShowChannels] = useState(true);

    useEffect(() => {
        db.collection('channels').onSnapshot(snapshot => {
            setChannels(snapshot.docs.map(doc => ({ id: doc.id, channel: doc.data() })));
        });
    }, [])

    useEffect(() => {
        db.collection('users').onSnapshot(snapshot => {
            setUsers(snapshot.docs.map(doc => ( doc.data() )));
        });
    }, [])

    // console.log(users)

    const handleAddChannel = () => {
        const channelName = prompt('Enter Channel Name');
        const channelType = prompt('Enter Channel Type');

        if (channelName) {
            db.collection('channels').add({ 
                channelName: channelName,
                channelType: channelType
            })
        }
    }
    // console.log(channels)

  return (
    <div className='sidebar'>
        <div className="sidebar__top">
            <h3>Cancer Discussion</h3>
            <ExpandMoreIcon onClick={() => setShowChannels(!showChannels)} />
        </div>

        {showChannels && (
            <div className="sidebar__channels">
                <div className="sidebar__channelsHeader">
                    <div className="sidebar__header">
                        <ExpandMoreIcon />
                        <h4>Text Channels</h4>
                    </div>
                    {/* {console.log(user)} */}
                    {user.uid === "53Dk3X5vmETYIXWmi1s3LnBtx1i2" && <AddIcon onClick ={handleAddChannel} className="sidebar__addChannel" />}
                </div>

                <div className="sidebar__channelsList">
                    {channels.map(( id, channel) => (
                        <SidebarChannel key ={id.id} id={id} channelName={id.channel.channelName} channelType={id.channel.channelType} />
                    ))}
                </div>
            </div>
        )}

        {/* <div className="sidebar__voice">
            <SignalCellularAltIcon
                className="sidebar__voiceIcon"
                fontSize="large"
            />
            <div className="sidebar__voiceInfo">
                <h3>Voice Connected</h3>
                <p>Steam</p>
            </div>
            <div className="sidebar__voiceIcons">
                <InfoOutlined />
                <Call />
            </div>
        </div> */}

        <div className="sidebar__profile">
            <Avatar onClick = {() => auth.signOut()} src={user.photo} />
            <div className="sidebar__profileInfo">
                <h3>{user.displayName}</h3>
                <p>{user.uid.substring(0, 5)}</p>
                <p>{user.email}</p>
            </div>
            <div className="sidebar__profileIcons">
                {/* <MicIcon /> */}
                {/* <Headset /> */}
                <SettingsIcon /> 
            </div>
        </div>

    </div>
  )
}

export default Sidebar