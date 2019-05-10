var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');




var app = express();

//Modelo del usuario
var Usuario = require('../models/usuario');
const SEED = require('../config/config').SEED;


//google
var CLIENT_ID = require('../config/config').CLIENT_ID;
var {OAuth2Client} = require('google-auth-library');
var client = new OAuth2Client(CLIENT_ID);

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    //const userid = payload['sub'];
    // If request specified a G Suite domain:
    //const domain = payload['hd'];
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
  }

/**
 * para la autenticacion por google
 */
app.post('/google', async (req, res)=>{
   var token = req.body.token;
   var googleUser = await verify(token).catch(e=>{
       return res.status(403).json({
        ok:false,
        mensaje: 'token no valido',
        errors: {mensaje: 'token no valido'}
       });
   })

   Usuario.findOne({email: googleUser.email}, (err, usuarioDB)=>{
        if(err){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error en base de datos, No se pudo obtener registro del usuario!',
                errors: err
            });
        }

        if( !usuarioDB ){
            if ( usuarioDB.google ){
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Debe de usuar su autenticación normal ',
                    errors: {mensaje: 'Debe de usuar su autenticación normal '}
                });
            }else {
                //crear un token
                var token = jwt.sign({ usuario: usuarioDB }, SEED, {expiresIn: 14442});
                usuarioDB.password = ':)';

                return res.status(200).json({
                    ok: true,
                    mensaje: 'ok',
                    usuario: usuarioDB,
                    token: token
                });
            }
        }else {
            var usuario = new Usuario();
            usuario.nombre = googleUser.name;
            usuario.email = googleUser.email;
            usuario.imag = googleUser.img;
            usuario.google = googleUser.google;
            usuario.password = ':)';

            usuario.save((err, usuarioPersis)=>{
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error en base de datos, No se pudo guardar  el usuario!',
                    errors: err
                });

                //crear un token
                var token = jwt.sign({ usuario: usuarioDB }, SEED, {expiresIn: 14442});
                usuarioPersis.password = ':)';

                return res.status(200).json({
                    ok: true,
                    mensaje: 'ok',
                    usuario: usuarioPersis,
                    token: token
                });
            });
        }
   })
});

app.post('/', (req, res)=> {

    var body = req.body;

    Usuario.findOne({email: body.email}, (err, usuarioDB)=>{
        if(err){
            return res.status(500).json({
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