const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');
const switche = require('./modals/switch'); // Assuming this is your mongoose model
require('./conn/conn');  // Database connection module

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Constants
const port = process.env.PORT || 5005;
let switchStatusCache = null; // Cache the switch status in memory


// Middleware
app.use(express.json());
app.use(cors());

// Serve static files
app.use(express.static(path.resolve(__dirname, 'client', 'dist')));

// Route to serve the frontend
app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'client', 'dist', 'index.html'));
});

// Fetch switch status from the database and cache it
const getSwitchStatus = async () => {
  try {
    if (switchStatusCache === null) {
      const query = await switche.findOne({ _id: '65d6e438d8371891f09f8b96' });
      switchStatusCache = query.status;
    }
    return switchStatusCache;
  } catch (error) {
    console.error('Error fetching switch status:', error);
    throw error;
  }
};

// Socket.IO connection handling
io.on('connection', async (socket) => {
  console.log('A user connected', socket.id);

  try {
    // Emit the cached or fetched switch status to the newly connected client
    const status = await getSwitchStatus();
    socket.emit('initialSwitchStatus', { status });

    // Handle status updates from the client
    socket.on('socketstatus', async (stats) => {
      console.log('New status from front', stats);

      // Update the database and cache
      await switche.findByIdAndUpdate('65d6e438d8371891f09f8b96', { status: stats });
      switchStatusCache = stats; // Update the cached status

      // Broadcast the updated status to all clients
      io.emit('switchStatusChanged', { status: stats });
    });
  } catch (error) {
    console.error('Socket error:', error);
  }
});

// Start the server
server.listen(port, () => {
  console.log(`Server listening at ${port}`);
});
