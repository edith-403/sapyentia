const Tesis = require('../models/tesis');
const fs = require('fs');
const uuid = require('uuid');

const registrarTesis = async (metadata, nombreArchivo)  =>
{
    const tesisRegistrada = await Tesis.count({'numero': metadata.numero});
    if (tesisRegistrada) 
    {
        return false;
    }

    const nuevaTesis = new Tesis();
    nuevaTesis.numero = metadata.numero;
    nuevaTesis.titulo = nombreArchivo;

    // Procesando los nombres de los integrantes
    let nombresIntegrantes = metadata.integrantes.split(',').map((item) => item.trim());
    nuevaTesis.integrantes = nombresIntegrantes;

    // Procesando los nombres de los directores
    let nombresDirectores = metadata.directores.split(',').map((item) => item.trim());
    nuevaTesis.directores = nombresDirectores;

    // Procesando los nombres de los sinodales
    let nombresSinodales = metadata.sinodales.split(',').map((item) => item.trim());
    nuevaTesis.sinodales = nombresSinodales;

    // Procesando las palabras clave
    let palabrasClave = metadata.palabrasClave.split(',').map((item) => item.trim());
    nuevaTesis.palabrasClave = palabrasClave;
    
    // Se guarda la ruta del archivo
    nuevaTesis.ruta = "../propuestas/" + metadata.numero + '.pdf';

    const tesisGuardada = await nuevaTesis.save();

    return true;
    
}

const registrarPropuesta = async (metadata, nombreArchivo) => 
{
    const nuevoNombreArchivo = uuid.v4() + '.pdf';
    fs.renameSync('./propuestas/' + nombreArchivo, './propuestas/' + nuevoNombreArchivo, (err) => {
        if (err) throw err;
      });

    const nuevaTesis = new Tesis();
    nuevaTesis.numero = "";
    nuevaTesis.titulo = metadata.titulo;
    nuevaTesis.escuela = metadata.escuela;

    // Procesando los nombres de los integrantes
    let nombresIntegrantes = metadata.integrantes.split(',').map((item) => item.trim());
    nuevaTesis.integrantes = nombresIntegrantes;

    nuevaTesis.sinodales = "";

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