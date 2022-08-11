/* eslint-disable no-unused-vars */
let express     = require('express'),
    http        = require('http'),
    WebSocket   = require("ws"),
    cors        = require('cors'),
    mongoose    = require('mongoose'),
    database    = require('./database'),
    bodyParser  = require('body-parser'),
    createError = require('http-errors'),
    path        = require("path"),
    jwt         = require('jsonwebtoken'),
    chat        = require('./messages/chat'),
    auth        = require('./messages/auth'),
    game        = require('./messages/game')

require('dotenv').config();

// Connect MongoDB
mongoose.Promise = global.Promise;
mongoose.connect(database.db, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('db connect');
}, error => {
    console.log('db error ' + error);
})

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}))

const server = http.createServer(app);

// Cors
app.use(cors());

// serve static files
app.use(express.static(path.join(__dirname, "./dist")))
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, './dist', 'index.html'))
})

// CREATE PORT
const port = process.env.PORT || 4000;
server.listen(port, () => {
    console.log('listening @ ' + server.address().port);
})

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function safe_parse(msg) {
    try {
        return JSON.parse(msg.toString());
    } catch (e) {
        return null;
    }
}

const clients = new Map();
const wss = new WebSocket.Server( { server } );

wss.on('connection', (ws) => {

    const id = uuidv4();
    const metadata = { id };
    clients.set(ws, metadata);
    ws.clients = clients;

    chat.send_history(ws);

    ws.on('message', (data) => {
        const message = safe_parse(data);
        if (!message) {
            return;
        }

        // check if token is provided
        if(!message.token && message.type != 'auth')
            return;

        message.decoded = false;

        // check if token is valid
        jwt.verify(message.token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return;
            }
            message.decoded = decoded;
        });

        // switch statement for message types
        switch (message.type) {
            case 'message':
                chat.say(message, ws, wss);
                break;
            case 'auth':
                auth.handle(message, ws, wss);
                break;
            case 'game':
                game.handle(message, ws, wss);
                break;
            default:
                break;
                
        }
    })

    ws.on("close", () => {
        console.log('client disconnected', id);
        clients.delete(ws);
    });

});

// 404 Handler
app.use((req, res, next) => {
    next(createError(404))
})

// error handler
app.use(function(err, req, res, next) {
    console.error(err.message);
    if (!err.statusCode) err.statusCode = 500;
    res.status(err.statusCode).send(err.message)
})