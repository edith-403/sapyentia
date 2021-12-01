const mongoose = require('mongoose');
const User = mongoose.model('user');
const ObjectId = require('mongodb').ObjectId;

const obtenerUsuario = async (id) => {
    const usuario = await User.findOne(
        {
            "_id": new ObjectId(id)
        }
    );
    const jsonUsuario = JSON.parse(JSON.stringify(usuario));
    return jsonUsuario;
}

const obtenerUsuarioPorCorreo = async (email) => {
    const usuario = await User.findOne(
        {
            "email": email
        }
    );
    const jsonUsuario = JSON.parse(JSON.stringify(usuario));
    return jsonUsuario;
}

const obtenerUsuarioPorNombre = async (nombre) => {
    const nombreRegex = new RegExp(nombre, 'i');
    const usuario = await User.find(
        {"$or":[
            {"nombre": nombreRegex},
            {"apellido_paterno": nombreRegex},
            {"apellido_materno": nombreRegex}
        ]}
    );

    return usuario;
}

module.exports = {obtenerUsuario, obtenerUsuarioPorCorreo, obtenerUsuarioPorNombre};