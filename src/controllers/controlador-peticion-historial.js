const controladorConsultasTesis = require('./controlador-peticion-tesis');
const controladorUsuarios = require('./controlador-usuarios')

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
    // Buscar solo tesis con número asignado
    let tesisTerminadas = result.filter(tesis => tesis.numero.length > 0);
    
    const correoProfesor = informacion.directores;

    tesisTerminadas = await Promise.all(tesisTerminadas.map(
        async function (tesis) {
            // Creando el campo de rol según participación
            if (tesis.directores.includes(correoProfesor)) {
                tesis.rol = "Director";
            } else {
                tesis.rol = "Sinodal";
            }
            // Cambiando correos por nombres
            tesis.directores = await Promise.all( tesis.directores.map(
                async (correo) => {
                    const usuario = await controladorUsuarios.obtenerUsuarioPorCorreo(correo);
                    return [usuario.nombre, usuario.apellido_paterno, usuario.apellido_materno].join(' ');
                }
            ));
            tesis.sinodales = await Promise.all(tesis.sinodales.map(
                async (correo) => {
                    const usuario = await controladorUsuarios.obtenerUsuarioPorCorreo(correo);
                    return [usuario.nombre, usuario.apellido_paterno, usuario.apellido_materno].join(' ');
                }
            ));

            tesis.createdAt = tesis.createdAt.toISOString().slice(0, 10);

            return tesis;
        }
    ));
    return tesisTerminadas;
}

module.exports.buscarTesisProfesor = buscarTesisProfesor;