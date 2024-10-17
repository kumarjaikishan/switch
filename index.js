const express = require('express');
const http = require('http');
const app = express();
const socketIo = require('socket.io');
const server = http.createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true
    }
});


const port = process.env.PORT || 5005;
const cors = require('cors');
const switche = require('./modals/switch');
const path = require('path');

app.use(express.json());
require('./conn/conn');
app.use(cors());

app.get('/', (req, res) => {
    app.use(express.static(path.resolve(__dirname, 'client', 'dist')));
    res.sendFile(path.resolve(__dirname, 'client', 'dist', 'index.html'));
});

// app.get('/switch', async (req, res) => {
//     try {
//         const query = await switche.findOne({ _id: '65d6e438d8371891f09f8b96' });
//         res.status(200).json({
//             msg: true,
//             data: query
//         });
//     } catch (error) {
//         res.status(500).json({
//             msg: error,
//         });
//     }
// });


// Socket.IO connection
io.on('connection', async (socket) => {
    console.log('A user connected', socket.id);

    // Fetch the current switch status from the database
    const query = await switche.findOne({ _id: '65d6e438d8371891f09f8b96' });

    // Emit the current status to the newly connected client
    socket.emit('initialSwitchStatus', { status: query.status });

    socket.on('socketstatus', async (stats) => {
        console.log('new status from front', stats);
        await switche.findByIdAndUpdate({ _id: '65d6e438d8371891f09f8b96' }, { status: stats });

        // Emitting a socket event after a switch POST request
        io.emit('switchStatusChanged', { status: stats });
    });
});


server.listen(port, () => {
    console.log(`server listening at ${port}`);
});
