const express = require('express');
const router = express.Router();

// controladores
const controladorUsuarios = require('../controllers/controlador-usuarios');

// rutas

router.get('/', async (req, res) => {
    const usuario = await controladorUsuarios.obtenerUsuario("618eb2881f1522f958590f34");
    
    if (usuario.type === "administrador") {
        res.render('./tests/home/admin', {tipoUsuario: usuario.type});
    } else {
        res.send('Error');
    }
});

module.exports = router;