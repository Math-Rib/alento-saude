require('dotenv').config();

const express      = require('express');
const path         = require('path');
const cookieParser = require('cookie-parser');
const bodyParser   = require('body-parser');

const authRoutes          = require('./src/routes/authRoutes');
const pacienteRoutes      = require('./src/routes/pacienteRoutes');
const medicoRoutes        = require('./src/routes/medicoRoutes');
const adminUsuarioRoutes  = require('./src/routes/adminUsuarioRoutes'); 

const app   = express();
const porta = 3000;

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'assets')));
app.use(express.static(path.join(__dirname, 'src')));
app.use('/css', express.static(path.join(__dirname, 'assets', 'css')));
app.use('/js',  express.static(path.join(__dirname, 'assets', 'js')));

app.use(authRoutes);
app.use(pacienteRoutes);
app.use(medicoRoutes);
app.use(adminUsuarioRoutes); 

app.use((req, res) => {
    res.status(404).send('Página não encontrada.');
});

app.listen(porta, () => {
    console.log(`Servidor rodando perfeitamente em http://localhost:${porta}/`);
});