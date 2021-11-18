const express = require('express');
const router = express.Router();

// controladores
const controladorUsuarios = require('../controllers/controlador-usuarios');
const controladorConsultaHistorial = require('../controllers/controlador-peticion-historial');

// rutas
router.get('/', async (req, res) => {
    const usuario = await controladorUsuarios.obtenerUsuario("618eb2881f1522f958590f34");
    
    if (usuario.type === "administrador") {
        const tesis = await controladorConsultaHistorial.obtenerTesisSinID({});
        res.render('./tests/index', {tipoUsuario: usuario.type, tesis: tesis});
    } else {
        res.send('Error');
    }
});

module.exports = router;
