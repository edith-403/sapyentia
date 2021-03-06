const Tesis = require('../models/tesis');
const asignarValoresDefecto = require('../helpers/asignar_valores_defecto')
const controladorUsuarios = require('./controlador-usuarios')

const obtenerInformacionTesis = async (informacion) => {
    filtros = asignarValoresDefecto.asignarValoresPorDefecto(informacion);
    const result = await procesarSolicitudTesis(filtros);
    // Buscar solo tesis con número asignado
    let tesisTerminadas = result.filter(tesis => tesis.numero.length > 0);

    tesisTerminadas = await Promise.all(tesisTerminadas.map(
        async function (tesis) {
            // Cambiando correos por nombres
            tesis.integrantes = await Promise.all( tesis.integrantes.map(
                async (correo) => {
                    const usuario = await controladorUsuarios.obtenerUsuarioPorCorreo(correo);
                    if (usuario)
                        return ' ' + [usuario.nombre, usuario.apellido_paterno, usuario.apellido_materno].join(' ');
                    return " Correo de usuario no encontrado"
                }
            ));
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
            
            // Formateando la fecha para solo mostrar año, mes y día
            tesis.createdAt = tesis.createdAt.toISOString().slice(0, 10);

            return tesis;
        }
    ));
    return tesisTerminadas;
}

const procesarSolicitudTesis = async (filtros, email = undefined) => {
    // Creando expresiones regulares para los integrantes
    const nombresIntegrantes = filtros.integrantes.split(',').map((item) => item.trim());
    
    // Se buscan los correos de los nombres matcheados
    const correosCoincidentes = (await Promise.all(nombresIntegrantes.flatMap(async (nombre) => {
        if (nombre.length == 0) 
            return "";
        const usuarios = await controladorUsuarios.obtenerUsuarioPorNombre(nombre);
        const usuariosEstudiantes = usuarios.filter(usuario => usuario.type === "estudiante")
        const correos = usuariosEstudiantes.map((usuario) => {
            return usuario.email;
        });
        return correos;
    }))).flat();
    const correosIntegrantesRegExp = correosCoincidentes.map( (correo) => {
        if (correo.length)
            return new RegExp(correo, 'i')
    });

    // Creando expresiones regulares para los sinodales
    const nombresSinodales = filtros.sinodales.split(',').map((item) => item.trim());
    const correosSinodales = 
    typeof email !== 'undefined' ? 
    [email] :
    (await Promise.all(nombresSinodales.flatMap(async (nombre) => {
        if (nombre.length == 0) 
            return "";
        const usuarios = await controladorUsuarios.obtenerUsuarioPorNombre(nombre);
        const usuariosSinodales = usuarios.filter(usuario => usuario.type === "docente")
        const correos = usuariosSinodales.map((usuario) => {
            return usuario.email;
        });
        return correos;
    }))).flat();
    const correosSinodalesRegExp = correosSinodales.map((correo) => {
        if (correo.length)
            return new RegExp(correo, 'i')
    });

    // Creando expresiones regulares para los directores
    const nombresDirectores = filtros.directores.split(',').map((item) => item.trim());
    const correosDirectores = 
    typeof email !== 'undefined' ? 
    [email] :
    (await Promise.all(nombresDirectores.flatMap(async (nombre) => {
        if (nombre.length == 0) 
            return "";
        const usuarios = await controladorUsuarios.obtenerUsuarioPorNombre(nombre);
        const usuariosDirectores = usuarios.filter(usuario => usuario.type === "docente")
        const correos = usuariosDirectores.map((usuario) => {
            return usuario.email;
        });
        return correos;
    }))).flat();
    const correosDirectoresRegExp = correosDirectores.map((correo) => {
        if (correo.length)
            return new RegExp(correo, 'i')
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
            {"integrantes": { "$in": correosIntegrantesRegExp }},
            {"sinodales": { "$in": correosSinodalesRegExp }},
            {"directores": { "$in": correosDirectoresRegExp }},
            {"palabrasClave": { "$in": nombresPalabrasClaveRegExp }},
            {"createdAt": {
                "$gt": new Date(filtros.fechaInicio),
                "$lt": new Date(filtros.fechaFin)
            }}
        ]}
    ).lean();
    return results;
}

const obtenerTesis = async () => {return await Tesis.find()}

const obtenerTesisId = async (id) => {
    try {
        return await Tesis.findById(id);   
    } catch (error) {
        console.log(error);
        return null;
    }
}

const obtenerNumeroTesis = async () => {
    var result = await Tesis.find();
    var numeroPropuestas = result.filter(tesis => tesis.numero.length == 0).length;
    var numeroTesis = result.length - numeroPropuestas;

    return {numeroPropuestas: numeroPropuestas, numeroTesis: numeroTesis};
}

module.exports = {procesarSolicitudTesis, obtenerTesis, obtenerTesisId, obtenerInformacionTesis, obtenerNumeroTesis};