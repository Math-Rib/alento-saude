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

/* Configura a rota da página principal do médico ao acessar o localhost */
app.get('/medico/home', (req, res) =>{
    /* Envia para o servidor o arquivo home_medico.html */
    res.sendFile(path.join(__dirname, 'src', 'views', 'private', 'medico', 'home_medico.html'));
});

/* Configura a rota da página gestão de agenda do médico ao acessar o localhost */
app.get('/medico/gestao_de_agenda', (req, res) =>{
    /* Envia para o servidor o arquivo gestao_agenda.html */
    res.sendFile(path.join(__dirname, 'src', 'views', 'private', 'medico', 'gestao_agenda.html'));
});

/* Configura a rota da página atendimento do médico ao acessar o localhost */
app.get('/medico/atendimento', (req, res) =>{
    /* Envia para o servidor o arquivo atendimento.html */
    res.sendFile(path.join(__dirname, 'src', 'views', 'private', 'medico', 'atendimento.html'));
});

/*  Configura a rota da página principal do admin ao acessar o localhost */
app.get('/admin/home', (req, res) =>{
    /* Envia para o servidor o arquivo home_admin.html*/
    res.sendFile(path.join(__dirname, 'src', 'views', 'private', 'admin', 'home_admin.html')); 
});

/*  Configura a rota da página gestão de usuário do admin ao acessar o localhost */
app.get('/admin/gestao_usuarios', (req, res) =>{
    /* Envia para o servidor o arquivo gestao_de_usuarios.html*/
    res.sendFile(path.join(__dirname, 'src', 'views', 'private', 'admin', 'gestao_usuario.html')); 
});

/*  Configura a rota da página gestão de especialidades do admin ao acessar o localhost */
app.get('/admin/gestao_especialidades', (req, res) =>{
    /* Envia para o servidor o arquivo gestao_especialidades.html*/
    res.sendFile(path.join(__dirname, 'src', 'views', 'private', 'admin', 'gestao_especialidades.html')); 
});

/*  Configura a rota da página logs de sistema do admin ao acessar o localhost */
app.get('/admin/logs_sistema', (req, res) =>{
    /* Envia para o servidor o arquivo logs_sistema.html*/
    res.sendFile(path.join(__dirname, 'src', 'views', 'private', 'admin', 'logs_sistema.html')); 
});

/*  Configura a rota da página backup do banco do admin ao acessar o localhost */
app.get('/admin/backup_banco', (req, res) =>{
    /* Envia para o servidor o arquivo backup_banco.html*/
    res.sendFile(path.join(__dirname, 'src', 'views', 'private', 'admin', 'backup_banco.html')); 
});

app.listen(porta, () => {
    console.log(`Servidor rodando em http://localhost:${porta}/`);
});