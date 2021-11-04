const Tesis = require('../models/tesis');

const procesarSolicitudTesis = async (filtros) => {
    // Creando expresiones regulares para los integrantes
    const nombresIntegrantes = filtros.integrantes.split(',').map((item) => item.trim());
    const nombresIntegrantesRegExp = nombresIntegrantes.map((nombre) => {
        if (nombre.length)
            return new RegExp(nombre, 'i')
    });

    // Creando expresiones regulares para los sinodales
    const nombresSinodales = filtros.sinodales.split(',').map((item) => item.trim());
    const nombresSinodalesRegExp = nombresSinodales.map((nombre) => {
        if (nombre.length)
            return new RegExp(nombre, 'i')
    });

    // Creando expresiones regulares para los directores
    const nombresDirectores = filtros.directores.split(',').map((item) => item.trim());
    const nombresDirectoresRegExp = nombresDirectores.map((nombre) => {
        if (nombre.length)    
            return new RegExp(nombre, 'i')
    });

    // Creando expresiones regulares para las palabras clave
    const nombresPalabrasClave = filtros.palabrasClave.split(',').map((item) => item.trim());
    const nombresPalabrasClaveRegExp = nombresPalabrasClave.map((palabra) => {
        if (palabra.length)
            return new RegExp(palabra, 'i')
    });

    const titulo = filtros.titulo.length > 0 ? new RegExp(filtros.titulo, 'i') : "";
    const escuela = filtros.escuela.length > 0 ? new RegExp(filtros.escuela, 'i') : "";

    const results = await Tesis.find(
        {"$or": [
            {"numero": filtros.numero},
            {"titulo": titulo},
            {"escuela": escuela},
            {"integrantes": { "$in": nombresIntegrantesRegExp }},
            {"sinodales": { "$in": nombresSinodalesRegExp }},
            {"directores": { "$in": nombresDirectoresRegExp }},
            {"palabrasClave": { "$in": nombresPalabrasClaveRegExp }},
        ]}
    );
    return results;
}

module.exports.procesarSolicitudTesis = procesarSolicitudTesis;