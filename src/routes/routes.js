const router = require('express').Router();
const passport = require('passport');
const multer = require('multer');

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

router.post('/archivos_tesis', upload.single('archivo'), (req, res, next) => {
  const file = req.file;
  if (!file) {
    const error = new Error('Please upload a file')
    error.httpStatusCode = 400;
    return next(error);
  }
});


function isAuthenticated(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }

  res.redirect('/')
}

module.exports = router;
