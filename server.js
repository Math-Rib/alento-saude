const express = require('express'); // Importando o Express para criar o servidor
const path = require('path'); // Importando o path para direcionar o caminho das páginas
const app = express();
const porta = 3000; // Criando a porta de acesso ao servidor

/* Configura o express para ler o CSS, o JS e Imagens da pasta */
app.use(express.static(path.join(__dirname, 'assets'))); 
/* Configura o express para ler as paginas*/
app.use(express.static(path.join(__dirname, 'src'))); 

/* Configura a rota principal ao acessar o localhost */
app.get('/', (req, res) => {
    /* Envia para o servidor o arquivo index.html */
    res.sendFile(path.join(__dirname, 'src', 'views', 'public', 'index.html'));
});

/* Configura a rota de contato ao acessar o localhost */
app.get('/contato', (req, res) => {
    /* Envia para o servidor o arquivo contato.html */
    res.sendFile(path.join(__dirname, 'src', 'views', 'public', 'contato.html'));
});

/* Configura a rota de login ao acessar o localhost */
app.get('/login', (req, res) => {
    /* Envia para o servidor o arquivo login.html */
    res.sendFile(path.join(__dirname, 'src', 'views', 'public', 'login.html'));
});

/* Configura a rota de cadastro ao acessar o localhost */
app.get('/cadastro', (req, res) => {
    /* Envia para o servidor o arquivo cadastro.html */
    res.sendFile(path.join(__dirname, 'src', 'views', 'public', 'cadastro.html'));
});

/* Configura a rota da página principal do paciente ao acessar o localhost */
app.get('/paciente/home', (req, res) => {
    /* Envia para o servidor o arquivo home_paciente.html */
    res.sendFile(path.join(__dirname, 'src', 'views', 'private', 'paciente', 'home_paciente.html'));
});

/* Configura a rota da página agendamento do paciente ao acessar o localhost */
app.get('/paciente/agendamento', (req, res) => {
    /* Envia para o servidor o arquivo agendamento.html */
    res.sendFile(path.join(__dirname, 'src', 'views', 'private', 'paciente', 'agendamento.html'));
});

/* Configura a rota da página histórico do paciente ao acessar o localhost */
app.get('/paciente/historico', (req, res) => {
    /* Envia para o servidor o arquivo historico_paciente.html */
    res.sendFile(path.join(__dirname, 'src', 'views', 'private', 'paciente', 'historico_paciente.html'));
});

app.listen(porta, () => {
    console.log(`Servidor rodando em http://localhost:${porta}/`);
});