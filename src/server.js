const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');
const cors = require('cors');
const path = require('path');
//const socketio = require('socket.io');
const http = require('http');

const app = express();
const server = http.Server(app);
//const io = socketio(server);

const io = require('socket.io')(server, {
    cors: {
      origin: '*',
    }
  });

mongoose.connect('mongodb+srv://gui:gui123@cluster0.irz1n.mongodb.net/ProjetoVI?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then( () => console.log("connected to DB."))
.catch( err => console.log(err));

const connectedUsers = {};

io.on('connection', socket => {
    const { user_id } = socket.handshake.query;

    connectedUsers[user_id] = socket.id;
    //console.log("connected to DB."+socket.id);
});

app.use((req, res, next) => {
    req.io = io;
    req.connectedUsers = connectedUsers;

    return next();
});

app.use(cors());

app.use(express.json());
app.use('/files', express.static(path.resolve(__dirname, '..', 'uploads')))
app.use(routes);


server.listen(3333);