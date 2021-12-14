const ListaTesis = require('../models/listaTesis');
const ObjectId = require('mongodb').ObjectId;

const registrarListaTesis = async (metadata)  =>
{
    const nuevaLista = new ListaTesis();
    nuevaLista.idUsuario = metadata.idUsuario;
    nuevaLista.idsTesis = metadata.idsTesis;
    
    await nuevaLista.save();
}

const obtenerListasDeUsuario = async (idUsuario) => {
    const listasGuardadas = await ListaTesis.find(
        {
            "idUsuario": idUsuario
        }
    );
    const jsonListasUsuario = JSON.parse(JSON.stringify(listasGuardadas));
    return jsonListasUsuario;
}

const obtenerListaPorId = async (idLista) => {
    const lista = await ListaTesis.findOne(
        {
            "_id": ObjectId(idLista)
        }
    );

    return lista;
}

module.exports = {registrarListaTesis, obtenerListasDeUsuario, obtenerListaPorId};