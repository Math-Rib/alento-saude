// config/supabase.js
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config(); // Garante a leitura das variáveis do ficheiro .env

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

// Validação de segurança: Impede que a app corra sem as credenciais necessárias
if (!supabaseUrl || !supabaseKey) {
    console.error('Erro Crítico: Não foi possível se conectar com o Supabase. Verifique a URL e a chave!');
    process.exit(1);
}

// Inicializa o cliente único do Supabase para toda a aplicação
const supabase = createClient(supabaseUrl, supabaseKey);

// Exporta a instância para ser utilizada nos Models da arquitetura MVC
module.exports = supabase;