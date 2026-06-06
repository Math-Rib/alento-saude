const express = require('express'); // Importando o Express para criar o servidor
const path = require('path'); // Importando o path para direcionar o caminho das páginas
const cookieParser = require('cookie-parser');
const authRoutes = require('./src/routes/authRoutes'); // Importando as rotas

const app = express();
const porta = 3000; // Criando a porta de acesso ao servidor

/* Configura middlewares globais */
app.use(cookieParser()); // Necessário para ler os cookies de sessão do Supabase
app.use(express.json()); // Body-parser para requisições JSON caso use fetch/axios
app.use(express.urlencoded({ extended: true }));

/* Configura o express para ler os arquivos staticos */
app.use(express.static(path.join(__dirname, 'assets')));
app.use(express.static(path.join(__dirname, 'src')));
app.use('/css', express.static(path.join(__dirname, 'assets', 'css')));
app.use('/js', express.static(path.join(__dirname, 'assets', 'js')));

/* Ativa as rotas importadas no servidor */
app.use(authRoutes);

app.listen(porta, () => {
    console.log(`Servidor rodando em http://localhost:${porta}/`);
});