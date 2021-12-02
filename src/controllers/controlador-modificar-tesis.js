const Tesis = require('../models/tesis');

const modificarTesisPorId = async (id, datos) => {
    // se verifica primero si el ID no ha sido ya asignado a otra tesis
    var numero = datos.numero;

    const result = await Tesis.find({ numero: numero });
    if (result.length > 0) {
        return [false, "El ID ya existe dentro de la base de datos, favor de ingresar otro"];
    }

    var integrantes = datos.integrantes.split(',');
    var directores = datos.directores.split(',');
    var sinodales = datos.sinodales.split(',');
    var palabrasClave = datos.palabrasClave.split(',');
    var titulo = datos.titulo;
    var escuela = datos.escuela;
    var updatedAt = new Date();

    Tesis.updateOne(
        { _id: id },
        { $set: {
            numero: numero,
            integrantes: integrantes,
            directores: directores,
            sinodales: sinodales,
            palabrasClave: palabrasClave,
            titulo: titulo,
            escuela: escuela,
            updatedAt: updatedAt
        }},
        (err) => {
            if (err) {
                console.log(err);
                return [false, "No se pudo actualizar en la base de datos, intentelo nuevamente"]; // TODO: This return is never reached in global scope, resolve
            }
        }
    );

    // returning all mails and removing duplicates
    mails = [...new Set(integrantes.concat(directores).concat(sinodales))];
    return [true, "Tesis modificada correctamente", mails];
}

const eliminarTesisPorId = async (id) => {
    Tesis.findOneAndDelete({ _id: id }, (err) => {
        if (err) {
            console.error;
            return false;
        }
    });

    return true;
}

module.exports = {modificarTesisPorId, eliminarTesisPorId};