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

module.exports = {obtenerUsuario: obtenerUsuario};