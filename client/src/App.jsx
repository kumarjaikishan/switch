import React, { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';
import './App.css';
import Button from './button';

const endpoint = '/'; // Use the full URL here

function App() {
  const [isOn, setIsOn] = useState(false);
  const [socket, setSocket] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('disconnected'); // 'disconnected', 'connecting', 'connected'

  useEffect(() => {
    setConnectionStatus('connecting'); // When establishing connection

    const socketIo = socketIOClient(endpoint); // Establish socket connection
    setSocket(socketIo); // Save socket connection in state

    socketIo.on('connect', () => {
      setConnectionStatus('connected'); // Socket is connected
    });

    socketIo.on('disconnect', () => {
      setConnectionStatus('disconnected'); // Socket is disconnected
    });

    socketIo.on('initialSwitchStatus', ({ status }) => {
      setIsOn(status);
      console.log('initial status:', status);
    });

    socketIo.on('switchStatusChanged', ({ status }) => {
      setIsOn(status);
    });

    return () => {
      socketIo.disconnect();
      setConnectionStatus('disconnected');
    };
  }, []);

  const handleSwitchChange = () => {
    const newStatus = !isOn;
    setIsOn(newStatus);
    if (socket) {
      socket.emit('socketstatus', newStatus); // Emit switch change event
    }
  };

  // Determine Wi-Fi icon color based on connection status
  const wifiIconColor = () => {
    switch (connectionStatus) {
      case 'disconnected':
        return 'red';  // Disconnected (red)
      case 'connecting':
        return 'yellow';  // Connecting (yellow)
      case 'connected':
        return 'green';  // Connected (green)
      default:
        return 'red';  // Fallback to red
    }
  };

  return (
    <div>
      <div id='status'>
       <i>Status : </i> <i
          className="fa fa-wifi"
          aria-hidden="true"
          style={{
            color: wifiIconColor(),
            fontSize: '2em',
          }}
        ></i>
      </div>
      <Button isOn={isOn} setIsOn={setIsOn} handleSwitchChange={handleSwitchChange} />
    </div>
  );
}

export default App;
