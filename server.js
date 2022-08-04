/* eslint-disable no-unused-vars */
let express     = require('express'),
    cors        = require('cors'),
    mongoose    = require('mongoose'),
    database    = require('./database'),
    bodyParser  = require('body-parser'),
    createError = require('http-errors'),
    path        = require("path")
    bcrypt      = require('bcrypt');
    jwt         = require('jsonwebtoken');
    auth        = require('./middleware/auth');

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
const server = app.listen(port, () => {
    console.log('listening @ ' + server.address().port);
})

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