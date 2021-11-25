const express = require('express');
const router = express.Router();

// middleware
router.use(express.urlencoded({extended: false}));
router.use(express.json());

// controladores
const controladorUsuarios = require('../controllers/controlador-usuarios');
const controladorConsultaHistorial = require('../controllers/controlador-peticion-historial');
const controladorConsultasTesis = require('../controllers/controlador-peticion-tesis');
const controladorModificarTesis = require('../controllers/controlador-modificar-tesis');

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

router.get('/:id', async (req, res) => {
    const usuario = await controladorUsuarios.obtenerUsuario("618eb2881f1522f958590f34");

    const tesis = await controladorConsultasTesis.obtenerTesisId(req.params.id);
    if (tesis) {
        res.render('./tests/editar_propuesta', {tipoUsuario: usuario.type, tesis: tesis});
    } else {
        res.redirect('/tests');
    }
});

router.post('/:id/modificar', async (req, res) => {
    const result = await controladorModificarTesis.modificarTesisPorId(req.params.id, req.body);
    
    if (result === true) {
        params = {
            success: "Propuesta modificada correctamente",
            status: "success"
        };
    } else {
        params = {
            success: "No se pudo modificar la tesis",
            status: "danger"
        };
    }

    const usuario = await controladorUsuarios.obtenerUsuario("618eb2881f1522f958590f34");
    const tesis = await controladorConsultasTesis.obtenerTesisId(req.params.id);
    res.render('./tests/editar_propuesta', {tipoUsuario: usuario.type, tesis: tesis});
});

module.exports = router;
