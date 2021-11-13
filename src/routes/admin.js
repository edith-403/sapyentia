const express = require('express');
const router = express.Router();

// controladores
const controladorUsuarios = require('../controllers/controlador-usuarios');

// rutas
router.get('/propuestas', async (req, res) => {
    const idUsuario = req.session.passport.user;
    const usuario = await controladorUsuarios.obtenerUsuario(idUsuario);
    res.render('./admin/propuestas_tesis', {tipoUsuario: usuario.type});
});

module.exports = router;
