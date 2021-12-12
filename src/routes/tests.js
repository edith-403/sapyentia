const express = require('express');
const router = express.Router();

// // controladores
// const controladorUsuarios = require('../controllers/controlador-usuarios');
// const controladorConsultasTesis = require("../controllers/controlador-peticion-tesis");

// rutas

// router.get('/', async (req, res) => {
//     const usuario = await controladorUsuarios.obtenerUsuario("618eb2881f1522f958590f34");
    
//     if (usuario.type === "administrador") {
//         const info = await controladorConsultasTesis.obtenerNumeroTesis();

//         res.render('./tests/home/admin', {tipoUsuario: usuario.type, nombre: usuario.nombre, email: usuario.email, numeroPropuestas: info.numeroPropuestas, numeroTesis: info.numeroTesis});
//     } else {
//         res.send('Error');
//     }
// });

module.exports = router;