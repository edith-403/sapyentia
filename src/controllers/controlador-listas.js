const ListaTesis = require('../models/listaTesis');

const registrarListaTesis = async (metadata)  =>
{
    const nuevaLista = new ListaTesis();
    nuevaLista.idUsuario = metadata.idUsuario;
    nuevaLista.idsTesis = metadata.idsTesis;
    
    await nuevaLista.save();
}

module.exports = {registrarListaTesis};