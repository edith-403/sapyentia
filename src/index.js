const express = require('express')
const app = express();
const engine = require('ejs-mate');
const path = require('path')
const morgan = require('morgan')

// Middleware
app.use(morgan('dev'));
app.use(express.json());

// Settings
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('port', process.env.PORT || 3000);

// Routes
app.use(require('./routes/index'));

// Iniciando servidor
app.listen(app.get('port'), () => {
    console.log('Servidor activo en el puerto', app.get('port'));
});