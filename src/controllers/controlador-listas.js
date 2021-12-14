const ListaTesis = require('../models/listaTesis');

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
            "_id": new ObjectId(idUsuario)
        }
    );
    const jsonListasUsuario = JSON.parse(JSON.stringify(usuario));
    return jsonListasUsuario;
}

module.exports = {registrarListaTesis, obtenerListasDeUsuario};