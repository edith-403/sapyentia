const express = require('express')
const router = express.Router();

router.get('/', (req, res, next) => {
    res.send("Página inicial");
});

router.get('/tesis', (req, res, next) => {
    res.json(
        [
            { 
                "Titulo": "Von Neumman Cellular Automatas",
                "Autor": "Erick Vargas"
            },
            { 
                "Titulo": "Algoritmos Genéticos para asignación de horarios",
                "Autor": "Alan Rodríguez"
            }
        ]  
    );
});

router.post('/user/home', (req, res, next) => {
    if (req.body.token) 
    {
        res.json({usuario: "Donaldo"});
    } 
    else
    {
        res.send("Token requerido");
    }    
});

router.post('/user/register', (req, res, next) => {
    const data = req.body;
    if ( data.nombre && data.password) 
    {
        res.send("Usuario registrado con éxito");
    } 
    else
    {
        res.send("Se requiere nombre y contraseña");
    }
});

router.post('/tesis/register', (req, res, next) => {
    const data = req.body;
    const metadatos = data.metadatos;
    if ( metadatos ) 
    {
        res.send("Datos registrados con éxito");
    } 
    else
    {
        res.send("Se necesitan los metadatos de la tésis");
    }
});

module.exports = router;