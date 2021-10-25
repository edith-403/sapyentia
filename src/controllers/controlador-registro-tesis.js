const Tesis = require('../models/tesis');

module.exports.registrarTesis = async function registrarTesis(metadata, nombreArchivo) 
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