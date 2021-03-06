const express = require('express');
const nodemailer = require('nodemailer');
const multer = require("multer");

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
const controladorConsultasTesis = require('../controllers/controlador-peticion-tesis');
const controladorConsultaHistorial = require("../controllers/controlador-peticion-historial");
const controladorModificarTesis = require('../controllers/controlador-modificar-tesis');
const controladorRegistros = require("../controllers/controlador-registro-tesis");

// rutas

router.get('/propuestas', async (req, res) => {
    const idUsuario = req.session.passport.user;
    const usuario = await controladorUsuarios.obtenerUsuario(idUsuario);
    
    if (usuario.type === "administrador") {
        const tesis = await controladorConsultaHistorial.obtenerTesisSinID();
        res.render('./admin/tesis', {tipoUsuario: usuario.type, tesis: tesis, titulo: 'Propuestas de tesis sin ID asignado'});
    } else {
        res.send('Error');
    }
});

router.get('/tesis', async (req, res) => {
    const idUsuario = req.session.passport.user;
    const usuario = await controladorUsuarios.obtenerUsuario(idUsuario);
    
    if (usuario.type === "administrador") {
        const tesis = await controladorConsultasTesis.obtenerTesis();
        res.render('./admin/tesis', {tipoUsuario: usuario.type, tesis: tesis, titulo: 'Tesis y propuestas'});
    } else {
        res.send('Error');
    }
});

router.get('/crear_tesis', async (req, res) => {
    const idUsuario = req.session.passport.user;
    const usuario = await controladorUsuarios.obtenerUsuario(idUsuario);
    res.render('./admin/formulario_tesis', {tipoUsuario: usuario.type, tesis: null, success: "", status: "", data: null});
});

const storage = multer.diskStorage({
    destination: "./public/propuestas",
    filename: function (req, file, done) {
        done("", file.originalname);
    },
});

const upload = multer({
    storage: storage
});

router.post('/crear_tesis', upload.single("archivo"), async (req, res) => {
    const idUsuario = req.session.passport.user;
    const usuario = await controladorUsuarios.obtenerUsuario(idUsuario);
    const result = await controladorRegistros.registrarTesis(req.body, req.file.originalname);

    info = "Registro exitoso";
    stat = "success"
    if (result[0] === true) {
        if (req.body.sendMessage) {
            await sendMail(
                result[1],
                "Registro de tesis asignada",
                "Se ha creado una nueva tesis con titulo '" + req.body.titulo + "' y se le ha asignado\n" + req.body.mensaje
            ).then(() => {
                info += " e involucrados notificados por correo electronico"
            }).catch(() => {
                console.error;
                info = ", pero no se pudo notificar a los involucrados via correo";
                stat = "warning";
            });
        }
        res.render('./admin/formulario_tesis', {
            tipoUsuario: usuario.type,
            tesis: null,
            success: info,
            status: stat,
            data: null
            }
        );
    } else {
        res.render('./admin/formulario_tesis', {
            tipoUsuario: usuario.type,
            tesis: null,
            success: 'El ID ya existe dentro de la base de datos, favor de ingresar otro',
            status: "danger",
            data: req.body
            }
        );
    }
});

router.get('/:id', async (req, res) => {
    const idUsuario = req.session.passport.user;
    const usuario = await controladorUsuarios.obtenerUsuario(idUsuario);

    const tesis = await controladorConsultasTesis.obtenerTesisId(req.params.id);
    if (tesis) {
        res.render('./admin/formulario_tesis', {tipoUsuario: usuario.type, tesis: tesis, success: "", status: "", data: null});
    } else {
        res.redirect('/admin');
    }
});

async function sendMail(mails, subject, message) {
    await transporter.sendMail({
        from: "'Repositorio de tesis' <sapyentia-no-reply@outlook.com>",
        to: mails,
        subject: subject,
        text: message
    });
}

/**
 * Type:
 * ?? 1 - Crear tesis
 * ?? 2 - Protocolo
 * ?? 3 - Editar tesis
 */
router.post('/:id/modificar', async (req, res) => {
    const result = await controladorModificarTesis.modificarTesisPorId(req.params.id, req.body);
    
    s = "secondary";
    data = null;
    if (result[0] === true) {
        s = "success";

        if (req.body.sendMessage || req.body.type == 2) {
            result[1] += " e involucrados notificados via correo electronico";

            mail = ["Tesis modificada", "La tesis con titulo '" + req.body.titulo + "' ha sido modificada"];
            estatus = req.body.status == true ? 'Aceptada' : 'Rechazada';
            estatus = req.body.status == -1 ? 'Sin status' : estatus;
            if (req.body.type == 2) {
                if (req.body.numero)
                    mail = ["Propuesta de tesis con ID asignado", "La propuesta de tesis con titulo '" + req.body.titulo + "'  ha sido asignada con el ID: " + req.body.numero + "\nCon status: " + estatus];
                else
                    mail = ["Propuesta de tesis modificada", "La propuesta de tesis con titulo '" + req.body.titulo + "'  ha sido modificada\nCon status: " + estatus];
            }
            if (req.body.mensaje)
                mail[1] += "\nY el administrador ha dejado el siguiente mensaje:\n" + req.body.mensaje;

            await sendMail(result[2], mail[0], mail[1]).catch(() => {
                console.error;
                s = "warning";
                result[1] = "Tesis modificada pero los involucrados no fueron notificados";
            });
        }
    } else {
        s = "danger";
        data = req.body;
    }

    const idUsuario = req.session.passport.user;
    const usuario = await controladorUsuarios.obtenerUsuario(idUsuario);
    const tesis = await controladorConsultasTesis.obtenerTesisId(req.params.id);
    res.render('./admin/formulario_tesis', {
        tipoUsuario: usuario.type,
        tesis: tesis,
        success: result[1],
        status: s,
        data: data
    });
});

router.get('/:id/delete', async (req, res) => {
    const result = await controladorModificarTesis.eliminarTesisPorId(req.params.id);

    if (result === false) {
        const tesis = await controladorConsultasTesis.obtenerTesisId(req.params.id);
        const idUsuario = req.session.passport.user;
    const usuario = await controladorUsuarios.obtenerUsuario(idUsuario);
        res.render('./admin/formulario_tesis', {
            tipoUsuario: usuario.type,
            tesis: tesis,
            success: "No se pudo eliminar de la base de datos. Int??ntelo m??s tarde nuevamente",
            status: "danger",
            data: null
        });   
    } else {
        res.redirect('/admin');
    }
});

router.get('/', async (req, res) => {
    const idUsuario = req.session.passport.user;
    const usuario = await controladorUsuarios.obtenerUsuario(idUsuario);
    
    if (usuario.type === "administrador") {
        const info = await controladorConsultasTesis.obtenerNumeroTesis();

        res.render('./admin/admin', {tipoUsuario: usuario.type, nombre: usuario.nombre, email: usuario.email, numeroPropuestas: info.numeroPropuestas, numeroTesis: info.numeroTesis});
    } else {
        res.send('Error');
    }
});

module.exports = router;
