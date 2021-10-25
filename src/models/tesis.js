const mongoose = require('mongoose');
const { Schema } = mongoose;

const tesisSchema = new Schema({
    numero: String,
    titulo: String,
    integrantes: [String],
    directores: [String],
    sinodales: [String],
    palabrasClave: [String],
    ruta: String,
    escuela: String
});

module.exports = mongoose.model('archivo', tesisSchema);