const Tesis = require('../models/tesis');

module.exports.registrarTesis = async function registrarTesis(metadata) 
{
    const tesisRegistrada = await Tesis.count({'titulo': metadata.titulo});
    if (tesisRegistrada) 
    {
        return false;
    }

    const nuevaTesis = new Tesis();
    nuevaTesis.numero = metadata.numero;
    nuevaTesis.titulo = metadata.titulo;

    // Procesando los nombres de los integrantes
    let nombresIntegrantes = metadata.integrantes.split(',').map((item) => item.trim());
    nuevaTesis.integrantes = nombresIntegrantes;

    // Procesando los nombres de los directores
    let nombresDirectores = metadata.directores.split(',').map((item) => item.trim());
    nuevaTesis.directores = nombresDirectores;

    // Procesando los nombres de los sinodales
    let nombresSinodales = metadata.sinodales.split(',').map((item) => item.trim());
    nuevaTesis.sinodales = nombresSinodales;
    
    // Se guarda la ruta del archivo
    nuevaTesis.ruta = "" + metadata.numero + '.pdf';

    const tesisGuardada = await nuevaTesis.save();

    return true;
    
}