const mongoose = require('mongoose');
const { Schema } = mongoose;

const listaTesisSchema = new Schema({
    idUsuario: String,
    idsTesis: [String],
},{
    timestamps: true,
});

module.exports = mongoose.model('listaTesis', listaTesisSchema);