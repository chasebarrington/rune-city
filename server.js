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
    auth        = require('./middleware/auth')

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

const userRoute = require('./route/user');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}))

const server = http.createServer(app);

// Cors
app.use(cors());

// API
app.use("/api/user", userRoute);

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

const clients = new Map();
const wss = new WebSocket.Server( { server } );
const msgs = [];
wss.on('connection', (ws) => {

    const id = uuidv4();
    const color = Math.floor(Math.random() * 360);
    const metadata = { id, color };

    clients.set(ws, metadata);
    
    // send the list of messages to the new client
    // wait 1 second and send the list of messages to the new client
    setTimeout(() => {
        ws.send(JSON.stringify(msgs));
    }, 1000);

    ws.on('message', (data) => {
        const message = JSON.parse(data.toString());
        
        if(message.type == 'message') {
            if (msgs.length > 100) {
                msgs.shift();
            }
            msgs.push(message);

            // send message to client
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(message));
                }
            });
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