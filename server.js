require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const express = require('express'); // Importando o Express para criar o servidor
const path = require('path'); // Importando o path para direcionar o caminho das páginas
const cookieParser = require('cookie-parser');
const pacienteRoutes = require('./src/routes/pacienteRoutes'); // Importando as rotas do paciente
const medicoRoutes   = require('./src/routes/medicoRoutes'); // Importando as rotas do médico
const authRoutes = require('./src/routes/authRoutes'); // Importando as rotas

const app = express();
const porta = 3000; // Criando a porta de acesso ao servidor

/* Configura middlewares globais */
const bodyParser = require('body-parser'); // ← adiciona no topo com os outros requires

/* Configura middlewares globais */
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/* Configura o express para ler os arquivos staticos */
app.use(express.static(path.join(__dirname, 'assets')));
app.use(express.static(path.join(__dirname, 'src')));
app.use('/css', express.static(path.join(__dirname, 'assets', 'css')));
app.use('/js', express.static(path.join(__dirname, 'assets', 'js')));

/* Ativa as rotas importadas no servidor */
app.use(authRoutes);
app.use(pacienteRoutes);
app.use(medicoRoutes);

/* caso a rota n seja encontrada */
app.use((req, res) => {
    res.status(404).send('Página não encontrada.');
});

app.listen(porta, () => {
    console.log(`Servidor rodando perfeitamente em http://localhost:${porta}/`);
});