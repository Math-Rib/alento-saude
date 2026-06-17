const supabase = require('../config/supabase');

// LISTAR
const listarAgenda = async (req, res) => {
    const { data, error } = await supabase
        .from('agenda_medico')
        .select('*')
        .order('horario');

    if (error) {
        return res.status(400).json(error);
    }

    res.json(data);
};

// CRIAR
const criarAgenda = async (req, res) => {
    const { paciente, dia_semana, horario } = req.body;

    const { data, error } = await supabase
        .from('agenda_medico')
        .insert([
            {
                paciente,
                dia_semana,
                horario
            }
        ])
        .select();

    if (error) {
        return res.status(400).json(error);
    }

    res.status(201).json(data);
};

// EDITAR
const atualizarAgenda = async (req, res) => {
    const { id } = req.params;
    const { paciente, dia_semana, horario } = req.body;

    const { data, error } = await supabase
        .from('agenda_medico')
        .update({
            paciente,
            dia_semana,
            horario
        })
        .eq('id', id)
        .select();

    if (error) {
        return res.status(400).json(error);
    }

    res.json(data);
};

// EXCLUIR
const excluirAgenda = async (req, res) => {
    const { id } = req.params;

    const { error } = await supabase
        .from('agenda_medico')
        .delete()
        .eq('id', id);

    if (error) {
        return res.status(400).json(error);
    }

    res.json({
        mensagem: 'Agendamento removido'
    });
};

module.exports = {
    listarAgenda,
    criarAgenda,
    atualizarAgenda,
    excluirAgenda
};