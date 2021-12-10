const mongoose = require('mongoose');
const { Schema } = mongoose;

const listaTesisSchema = new Schema({
    idUsuario: String,
    idTesis: [String],
},{
    timestamps: true,
});

module.exports = mongoose.model('listaTesis', listaTesisSchema);