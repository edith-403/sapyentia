const controladorConsultasTesis = require('./controlador-peticion-tesis');

const asignarValoresPorDefecto = (filtros) => {
    if (!filtros.hasOwnProperty('numero'))
        filtros.numero = "";
    if (!filtros.hasOwnProperty('integrantes'))
        filtros.integrantes = "";
    if (!filtros.hasOwnProperty('sinodales')) 
        filtros.sinodales = "";
    if (!filtros.hasOwnProperty('directores')) 
        filtros.directores = "";
    if (!filtros.hasOwnProperty('palabrasClave')) 
        filtros.palabrasClave = "";
    if (!filtros.hasOwnProperty('titulo')) 
        filtros.titulo = "";
    if (!filtros.hasOwnProperty('escuela')) 
        filtros.escuela = "";
    return filtros;
}

const buscarTesisProfesor = async (informacion) => {
    filtros = asignarValoresPorDefecto(informacion);
    const result = await controladorConsultasTesis.procesarSolicitudTesis(filtros);
    return result;
}

module.exports.buscarTesisProfesor = buscarTesisProfesor;