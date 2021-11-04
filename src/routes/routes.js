const router = require('express').Router();
const passport = require('passport');
const multer = require('multer');
const controladorRegistros = require('../controllers/controlador-registro-tesis')
const controladorConsultasTesis = require('../controllers/controlador-peticion-tesis');
const controladorConsultaHistorial = require('../controllers/controlador-peticion-historial');
const controladorUsuarios = require('../controllers/controlador-usuarios');

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

router.get('/docente/historial', async (req, res, next) => {
  res.render('tabla_historial');
});

router.get('/docente/historial/:id', async (req, res, next) => {
  const result = await controladorConsultaHistorial.buscarTesisProfesor({numero: req.params.id});
  res.send(result);
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
  const result = await controladorRegistros.registrarTesis(req.body, req.file.originalname);
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
  const usuario = await controladorUsuarios.obtenerTipoUsuario(idUsuario);
  const dataObject = {tipoUsuario: usuario.type};
  res.render('profile', dataObject);
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
