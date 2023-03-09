const express = require('express');
const app = express();
const todocontroller = require('./controller/todocontroller');
const PORT = process.env.PORT || 3000;
var admin = require("firebase-admin");
// const methodOverride = require('method-override');

require('dotenv').config();
const EventEmitter = require('events');
const emitter = new EventEmitter();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
// app.use(methodOverride('_method'));
const session = require('express-session');
app.use(session({
  secret: 'secrettodoapp',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));
const deletefb = admin.firestore.FieldValue.delete();
const obj = {
    "type": "service_account",
    "project_id": "ichiropractic",
    "private_key_id": process.env.PRIVATE_KEY_ID,
    "private_key": process.env.PRIVATE_KEY,
    "client_email": process.env.CLIENT_EMAIL,
    "client_id": process.env.CLIENT_ID,
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-6j77x%40ichiropractic.iam.gserviceaccount.com"
  }
app.use(bodyParser.json());
var serviceAccount = require("./urlshortener-64219-firebase-adminsdk-qjx9n-6f337af7e7.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://urlshortener-64219-default-rtdb.firebaseio.com"
});

app.set('view engine', 'ejs');
app.use(express.static('public'));
const db = admin.firestore();
todocontroller(app,db,deletefb);
app.use(express.static(__dirname + '/public'));


app.listen(3000, () => {
    console.log('Server is running');
});
