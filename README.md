# Alento Saúde 🏥

O **Alento Saúde** é uma plataforma web desenvolvida para a gestão e agendamento de consultas médicas, atendimento de pacientes e administração do sistema de saúde. A aplicação foi construída utilizando uma arquitetura organizada e segura, conectada diretamente ao banco de dados e autenticação do **Supabase**.

---

## 🚀 Arquitetura do Projeto (MVC)

O projeto adota o padrão de arquitetura **MVC (Model-View-Controller)** para garantir a separação de responsabilidades, facilidade de manutenção e escalabilidade:

- **Model (Modelos):** Localizado em `src/models/`, contém a lógica de dados e a comunicação direta com as tabelas do Supabase.
- **View (Páginas):** Localizado em `src/views/`, subdividido em áreas públicas (`public` para login, cadastro e index) e áreas privadas (`private` para as dashboards de pacientes, médicos e administradores).
- **Controller (Controladores):** Localizado em `src/controllers/`, faz a ponte entre os modelos e as visões, processando as regras de negócio.
- **Config:** A pasta `config/` centraliza a inicialização e segurança do cliente Supabase.

---

## 🛠️ Tecnologias Utilizadas

- **Backend:** Node.js, Express
- **Banco de Dados & Autenticação:** Supabase (PostgreSQL)
- **Frontend:** HTML5, CSS3, JavaScript (arquivos estáticos em `assets/`)

---

## 📦 Dependências do Projeto

As seguintes bibliotecas do ecossistema Node.js estão instaladas e são fundamentais para o funcionamento da aplicação:

- **`express`**: Framework web utilizado para gerenciar as rotas HTTP, middlewares e renderização das páginas.
- **`@supabase/supabase-js`**: Cliente oficial do Supabase, responsável pela autenticação de usuários e operações de banco de dados (CRUD).
- **`dotenv`**: Carrega variáveis de ambiente a partir do arquivo `.env` para o projeto, protegendo dados sensíveis.

## 🛠️ Dependências de Desenvolvimento 
- **`nodemon`**: Ferramenta utilitária que reinicia automaticamente o servidor Node.js sempre que uma alteração no código fonte é detectada, agilizando o processo de desenvolvimento.

## 💻 Comandos de Instalação e Inicialização (NPM)

Utilize os comandos do **npm** abaixo no seu terminal para configurar e rodar o ambiente do projeto assim que realizar o download:

### 1. Inicialize o terminal e instale o pacote Express:
npm i express
ou
npm install express

### 2. Instale o pacote @supabase/supabase-js:
npm i @supabase/supabase-js
ou
npm install  @supabase/supabase-js

### 3. Instale o pacote dotenv:
npm i dotenv
ou
npm install dotenv

### 4. Instale o pacote Nodemon:
npm i nodemon
ou
npm install nodemon