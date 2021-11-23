const controladorConsultasTesis = require('./controlador-peticion-tesis');
const controladorUsuarios = require('./controlador-usuarios')
const asignarValoresDefecto = require('../helpers/asignar_valores_defecto');

const buscarTesisProfesor = async (informacion) => {
    filtros = asignarValoresDefecto.asignarValoresPorDefecto(informacion);
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

const obtenerTesisSinID = async () => {
    const result = await controladorConsultasTesis.obtenerTesis();
    let tesisTerminadas = result.filter(tesis => tesis.numero.length == 0);
    // cambiando fecha, desconozco porque no se pudo realizar con Promise, se termino solucionando creando otro objeto nuevo
    tesisTerminadas = tesisTerminadas.map((tesis) => {
        let obj = {};
        obj._id = tesis._id;
        obj.titulo = tesis.titulo;
        obj.integrantes = tesis.integrantes;
        obj.createdAt = tesis.createdAt.toISOString().slice(0, 10);
        return obj;
    });
    return tesisTerminadas;
}

module.exports.buscarTesisProfesor = buscarTesisProfesor;
module.exports.obtenerTesisSinID = obtenerTesisSinID;