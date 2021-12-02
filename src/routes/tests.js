const express = require('express');
const nodemailer = require('nodemailer');

const router = express.Router();
const transporter = nodemailer.createTransport({
    host: 'smtp-mail.outlook.com',
    port: 587,
    secure: false,
    auth: {
        user: 'sapyentia-no-reply@outlook.com',
        pass: 'E$COM22-1'
    },
    tls: {
        rejectUnauthorized: false
    }
});


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
        res.render('./tests/tesis', {tipoUsuario: usuario.type, tesis: tesis});
    } else {
        res.send('Error');
    }
});

router.get('/:id', async (req, res) => {
    const usuario = await controladorUsuarios.obtenerUsuario("618eb2881f1522f958590f34");

    const tesis = await controladorConsultasTesis.obtenerTesisId(req.params.id);
    if (tesis) {
        res.render('./tests/editar', {tipoUsuario: usuario.type, tesis: tesis, success: "", status: "", data: null});
    } else {
        res.redirect('/tests');
    }
});

async function sendMail(mails, id, title) {
    const info = await transporter.sendMail({
        from: "'Repositorio de tesis' <sapyentia-no-reply@outlook.com>",
        to: mails,
        subject: 'Propuesta de tesis con ID asignado',
        text: 'La propuesta de tesis con titulo "' + title + '" ha sido asignada con el ID: ' + id
    });
}

router.post('/:id/modificar', async (req, res) => {
    const result = await controladorModificarTesis.modificarTesisPorId(req.params.id, req.body);
    
    s = "secondary";
    data = null;
    if (result[0] === true) {
        s = "success";
        result[1] += " e involucrados notificados via correo electronico"

        await sendMail(result[2], req.body.numero, req.body.titulo).catch(() => {
            console.error;
            s = "warning";
            result[1] = "Tesis modificada pero los involucrados no fueron notificados";
        });
    } else {
        s = "danger";
        data = req.body;
    }

    const usuario = await controladorUsuarios.obtenerUsuario("618eb2881f1522f958590f34");
    const tesis = await controladorConsultasTesis.obtenerTesisId(req.params.id);
    res.render('./tests/editar', {
        tipoUsuario: usuario.type,
        tesis: tesis,
        success: result[1],
        status: s,
        data: data
    });
});

router.post('/:id/editar', (req, res) => {
    res.send("Editando...");
});

module.exports = router;