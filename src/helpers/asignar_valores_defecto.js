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
    if (!filtros.hasOwnProperty('fechaInicio')) 
        filtros.fechaInicio = new Date();
    if (!filtros.hasOwnProperty('fechaFin'))
        filtros.fechaFin = new Date();
    return filtros;
}

module.exports = {asignarValoresPorDefecto};