var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');


var Schema = mongoose.Schema;

var rolesValidos  = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{{VALUE}} NO es un rol valido'
}

var usuarioSchema = new Schema({
    nombre: {type: String, required: [true, 'El nombre es necesario']},
    email: {type: String,unique: true ,required: [true, 'El correo es necesario']},
    password: {type: String, required: [true, 'La contraceña es necesario']},
    img: {type: String, required: [false]},
    role: {type: String, required: true, default: 'USER_ROLE', enum: rolesValidos}
});

/**
 * IMPORTANTE--->CUANDO la solisitud no cumpre con estas vlalidaciones el servidor se detiene 
 * REVISAR MAS ADELANTE.
*/
usuarioSchema.plugin( uniqueValidator, {message: 'El {PATH} debe de ser unico'} );

module.exports = mongoose.model('Usuario', usuarioSchema);