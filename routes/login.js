var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');



var app = express();

//Modelo del usuario
var Usuario = require('../models/usuario');
const SEED = require('../config/config').SEED;


app.post('/', (req, res)=> {

    var body = req.body;

    Usuario.findOne({email: body.email}, (err, usuarioDB)=>{
        if(err){
            res.status(500).json({
                ok: false,
                mensaje: 'Error en base de datos, No se pudo obtener registro del usuario!',
                errors: err
            });
        }

        if( !usuarioDB ){
            return res.status(400).json({
                ok: false,
                mensaje: 'email o correo incorrecto--email'
            });
        }

        if(!bcrypt.compareSync(body.password, usuarioDB.password)){ 
            return res.status(400).json({
                ok: false,
                mensaje: 'email o correo incorrecto-pass'
            });
        }

        //crear un token
        var token = jwt.sign({ usuario: usuarioDB }, SEED, {expiresIn: 14442});
        usuarioDB.password = ':)';

        return res.status(200).json({
            ok: true,
            mensaje: 'ok',
            usuario: usuarioDB,
            token: token
        });


    });



});



module.exports = app; 