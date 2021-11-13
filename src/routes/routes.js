const router = require('express').Router();
const passport = require('passport');
const multer = require('multer');
const controladorRegistros = require('../controllers/controlador-registro-tesis')
const controladorConsultasTesis = require('../controllers/controlador-peticion-tesis');
const controladorConsultaHistorial = require('../controllers/controlador-peticion-historial');
const controladorUsuarios = require('../controllers/controlador-usuarios');
const uuid = require('uuid');

router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/signup', (req, res, next) => {
  res.render('signup');
});

router.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/profile',
  failureRedirect: '/signup',
  failureFlash: true
})); 

router.get('/signin', (req, res, next) => {
  res.render('signin');
});

router.post('/signin', passport.authenticate('local-signin', {
  successRedirect: '/profile',
  failureRedirect: '/signin',
  failureFlash: true
}));

router.get('/tesis', async (req, res, next) => {
  console.log(req.body)
  const results = await controladorConsultasTesis.procesarSolicitudTesis(req.body);
  res.send(results);
});

const storage = multer.diskStorage({
  destination: './propuestas',
  filename: function (req, file, done) {
    done('', file.originalname)
  }
});

const upload = multer({
  storage: storage
});

router.get('/propuestas', (req, res, next) => {
  res.render('formulario_tesis', {success: '', status: ''});
});

router.post('/propuestas', upload.single('archivo'), async (req, res, next) => {
  const result = await controladorRegistros.registrarPropuesta(req.body, req.file.originalname);
  if (result === false) {
    res.render('formulario_tesis', {success: 'La tesis ya existe', status: 'danger'});
  }
  else {
    res.render('formulario_tesis', {success: 'Propuesta enviada correctamente', status: 'success'});
  }
});

router.use((req, res, next) => {
    isAuthenticated(req, res, next);
});

router.get('/profile', async (req, res, next) => {
  const idUsuario = req.session.passport.user;
  const usuario = await controladorUsuarios.obtenerUsuario(idUsuario);
  res.render('profile', {tipoUsuario: usuario.type});
});

router.get('/docente/historial', async (req, res, next) => {
  const idUsuario = req.session.passport.user;
  const usuario = await controladorUsuarios.obtenerUsuario(idUsuario);
  if (usuario.type === "docente") {
    const tesisRelacionadas = await controladorConsultaHistorial.buscarTesisProfesor({
      "directores": usuario.nombre.concat(' ', usuario.apellido_paterno).concat(' ', usuario.apellido_materno)
    });
    res.render('tabla_historial', {tesis: tesisRelacionadas});
  } else {
    res.redirect('/profile');
  }
});

router.get('/docente/historial/:id', async (req, res, next) => {
  const result = await controladorConsultaHistorial.buscarTesisProfesor({numero: req.params.id});
  res.send(result[0]);
});

router.get('/admin/propuestas', async (req, res, next) => {
  const idUsuario = req.session.passport.user;
  const usuario = await controladorUsuarios.obtenerUsuario(idUsuario);
  res.render('./admin/propuestas_tesis', {tipoUsuario: usuario.type});
});

router.get('/dashboard', (req, res, next) => {
    res.send('Dashboard');
  });

router.get('/logout', (req, res, next) => {
  req.logout();
  res.redirect('/');
});

function isAuthenticated(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }
  res.redirect('/')
}

module.exports = router;
