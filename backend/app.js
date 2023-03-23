require('dotenv').config();

const express = require('express');
const path = require('path');
const cors = require('cors');

// database and models
const { db } = require('./config/db');
const Usuario = require('./models/Usuario');
const Reuniao = require('./models/Reuniao');
const Pauta = require('./models/Pauta');
const Participante = require('./models/Participante');
const Votacao = require('./models/Votacao');

const port = process.env.PORT;

const app = express();

// config JSON and form data response
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// solve cors
app.use(cors({ credentials: true, origin: 'http://localhost:3001' }));

// synchronizing database
const syncDB = async () => {
    try {
        await db.sync();
    } catch (error) {
        console.log(error);
    }

};
syncDB();

// routes
const router = require('./routes/Router');
app.use(router);


// starting server
app.listen(port, () => {
    console.log('Server running');
});