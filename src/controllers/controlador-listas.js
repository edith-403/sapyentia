const ListaTesis = require('../models/listaTesis');

const registrarListaTesis = async (metadata)  =>
{
    const nuevaLista = new ListaTesis();
    nuevaTesis.idUsuario = metadata.idUsuario;
    nuevaTesis.idsTesis = metadata.idsTesis;
    
    await nuevaListaTesis.save();
}

module.exports = {registrarListaTesis};