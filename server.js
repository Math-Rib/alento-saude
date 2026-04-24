const express = require('express'); // Importando o Express para criar o servidor
const path = require('path'); // Importando o path para direcionar o caminho das páginas
const app = express();
const porta = 3000; // Criando a porta de acesso ao servidor

/* Configura o express para ler o CSS, o JS e Imagens da pasta */
app.use(express.static(path.join(__dirname, 'assets'))); 
app.use(express.static(path.join(__dirname,'src', 'views','public')));
/* Configura a rota principal ao acessar o localhost */
app.get('/', (req, res) => {
    /* Envia para o servidor o arquivo index.html */
    res.sendFile(path.join(__dirname, 'src', 'views', 'public', 'index.html'));
});

app.get('/cadastro', (req, res) => {
        /* Envia para o servidor o arquivo cadastro.html */
    res.sendFile(path.join(__dirname, 'src', 'views', 'public', 'cadastro.html'))
})
app.listen(porta, () => {
    console.log(`Servidor rodando em http://localhost:${porta}/`);
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'views', 'public', 'login.html'));
});

app.get('/bancodedados', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'views', 'private', 'admin', 'bancodeados.html'));
});
