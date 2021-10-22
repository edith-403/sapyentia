const router = require('express').Router();
const passport = require('passport');
const multer = require('multer');
const controladorRegistros = require('../controllers/controlador-registro-tesis.js')

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

const storage = multer.diskStorage({
  destination: './archivos_tesis',
  filename: function (req, file, done) {
    done('', file.originalname)
  }
});

const upload = multer({
  storage: storage
});

router.get('/archivos_tesis', (req, res, next) => {
  res.render('formulario_tesis');
});

router.post('/archivos_tesis', upload.single('archivo'), async (req, res, next) => {
  const file = req.file;
  // Manejar el caso donde no se manda un archivo
  console.log("result")
  const result = await controladorRegistros.registrarTesis(req.body)
  console.log(result)
  res.sendStatus(200)
});

router.use((req, res, next) => {
    isAuthenticated(req, res, next);
    next();
});

router.get('/profile', (req, res, next) => {
  res.render('profile');
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
