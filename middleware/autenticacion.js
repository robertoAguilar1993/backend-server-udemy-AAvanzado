var jwt = require('jsonwebtoken');
var Usuario = require('../models/usuario');
const SEED = require('../config/config').SEED;


exports.verificaToken = function(req, res, next){
    var token = req.query.token;
    console.log('token');
    console.log(token);

    jwt.verify(token, SEED, (err, decoded)=>{
        if ( err ) {
            res.status(402).json({
                ok: false,
                mensaje: 'Token incorrecto',
                errors: err
            });
        }

        req.usuario =  decoded.usuario;
        next();

    });

}