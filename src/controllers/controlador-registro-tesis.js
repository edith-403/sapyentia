const Tesis = require('../models/tesis');
const fs = require('fs');
const uuid = require('uuid');

const registrarTesis = async (metadata, nombreArchivo)  =>
{
    if (metadata.numero) {
        const tesisRegistrada = await Tesis.count({'numero': metadata.numero});
        if (tesisRegistrada) {
            // await unlinkSync('./public/propuestas/' + nombreArchivo);
            return [false];
        }
    }

    const nuevoNombreArchivo = uuid.v4() + '.pdf';
    fs.renameSync('./public/propuestas/' + nombreArchivo, './public/propuestas/' + nuevoNombreArchivo, (err) => {
        if (err) throw err;
    });

    const nuevaTesis = new Tesis();
    nuevaTesis.numero = metadata.numero;
    nuevaTesis.titulo = metadata.titulo;
    nuevaTesis.escuela = metadata.escuela;

    // Procesando los correos de los integrantes
    let nombresIntegrantes = metadata.integrantes.split(',').map((item) => item.trim());
    nuevaTesis.integrantes = nombresIntegrantes;

    // Procesando los correos de los sinodales
    let correosSinodales = metadata.sinodales.split(',').map((item) => item.trim());
    nuevaTesis.sinodales = correosSinodales;

    // Procesando los correos de los directores
    let correosDirectores = metadata.directores.split(',').map((item) => item.trim());
    nuevaTesis.directores = correosDirectores;

    // Procesando las palabras clave
    let palabrasClave = metadata.palabrasClave.split(',').map((item) => item.trim());
    nuevaTesis.palabrasClave = palabrasClave;
    
    // Se guarda la ruta del archivo
    nuevaTesis.ruta = nuevoNombreArchivo;

    nuevaTesis.status = metadata.status;

    await nuevaTesis.save();

    var mails = [...new Set(nombresIntegrantes.concat(correosDirectores).concat(correosSinodales))];
    return [true, mails];
    
}

const registrarPropuesta = async (metadata, nombreArchivo) => 
{
    const nuevoNombreArchivo = uuid.v4() + '.pdf';
    fs.renameSync('./public/propuestas/' + nombreArchivo, './public/propuestas/' + nuevoNombreArchivo, (err) => {
        if (err) throw err;
      });

    const nuevaTesis = new Tesis();
    nuevaTesis.numero = "";
    nuevaTesis.titulo = metadata.titulo;
    nuevaTesis.escuela = metadata.escuela;

    // Procesando los nombres de los integrantes
    let nombresIntegrantes = metadata.integrantes.split(',').map((item) => item.trim());
    nuevaTesis.integrantes = nombresIntegrantes;

    nuevaTesis.sinodales = [];

    // Procesando los correos de los directores
    let correosDirectores = metadata.directores.split(',').map((item) => item.trim());
    nuevaTesis.directores = correosDirectores;

    // Verificar que los correeos de los directores so

    // Procesando las palabras clave
    let palabrasClave = metadata.palabrasClave.split(',').map((item) => item.trim());
    nuevaTesis.palabrasClave = palabrasClave;
    
    // Se guarda la ruta del archivo
    nuevaTesis.ruta = nuevoNombreArchivo;

    await nuevaTesis.save();

    return true;
}

module.exports = {registrarTesis, registrarPropuesta};