const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = express();

dotenv.config();

mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization, jwt');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(bodyParser.json());

const usersRouter = require('./routes/User');

app.use('/api/user', usersRouter);

const oauthGoogleRouter = require('./src/oAuthG.js');

app.use('/oauth', oauthGoogleRouter);

const gmailWidget = require('./src/gmailWidget.js');

app.use('/api/gmailWidget', gmailWidget);

const oauthFacebookRouter = require('./src/oAuthF.js');

app.use('/oauth', oauthFacebookRouter);

const oauthTwitterRouter = require('./src/oAuthT.js');

app.use('/oauth', oauthTwitterRouter);

const token = require('./routes/token.js');

app.use('/api/token', token);

const subscribeRouter = require('./routes/subscribe');

app.use('/api/subscribe', subscribeRouter);

module.exports = app;
