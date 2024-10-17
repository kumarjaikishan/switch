
import React, { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';
import './App.css'
import Button from './button';

const endpoint = '/'; // Use the full URL here

function App() {
  const [isOn, setIsOn] = useState(false);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    console.log(endpoint)
    const socketIo = socketIOClient(endpoint); // Establish socket connection
    setSocket(socketIo); // Save socket connection in state

    socketIo.on('initialSwitchStatus', ({ status }) => {
      setIsOn(status)
      console.log('initial status:', status)
    });
    socketIo.on('switchStatusChanged', ({ status }) => {
      setIsOn(status)
    });
    return () => socketIo.disconnect();
  }, []);

  const handleSwitchChange = () => {
    const newStatus = !isOn;
    setIsOn(!isOn)
    if (socket) {
      socket.emit('socketstatus', newStatus); // Now socket is in scope
    }
  };

  return (
    <div>
      <Button isOn={isOn} setIsOn={setIsOn} handleSwitchChange={handleSwitchChange} />
    </div>
  );
}

export default App;
