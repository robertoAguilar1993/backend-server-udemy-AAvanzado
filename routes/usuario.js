var express = require('express');
var bcrypt = require('bcryptjs');
var mdAutenticacion = require('../middleware/autenticacion');



var app = express();

var Usuario = require('../models/usuario');

/**
 * Obtener todos los usuarios
 */
app.get('/',  (req, res)=> {
    Usuario.find({ }, '_id nombre email img role ')
        .exec((err, usuarios) => {
            if ( err ) {
                res.status(500).json({
                    ok: false,
                    mensaje: 'Error en base de datos, cargando usuarios!',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                mensaje: 'get de Usuario!',
                results: usuarios
            });
         });
});





/**
 * Actualizar   usuario
 */
app.put('/:id',mdAutenticacion.verificaToken ,(req, res)=> {
    var id = req.params.id;
    console.log(id);
    Usuario.findById(id, (err, usuario)=>{
        if ( err ) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario!',
                errors: err
            });
        }
        if( !usuario ){
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe el usuario: ' + id,
                errors: {mensaje: 'NO esiste el usuario'}
            });
        }

        var body = req.body;

        usuario.nombre= body.nombre;
        usuario.email= body.email;
        usuario.role= body.role;

        usuario.save((err, usuarioUpdate)=>{
            if(err){
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar el  usuario!',
                    errors: err
                });
            }
            usuarioUpdate.password = ':)';
            res.status(200).json({
                ok: true,
                mensaje: 'Usuario Actualizado!',
                usuario: usuarioUpdate
            });
        });

    }); 

});

/**
 * Guardar un  usuario
 */
app.post('/', mdAutenticacion.verificaToken, (req, res)=> {
    console.log(req.body);
    var body = req.body;
    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    usuario.save((err, usuarioGuardado) => {
        if(err){
            res.status(400).json({
                ok: false,
                mensaje: 'Error en base de datos, No se pudo guardar en la base de datos!',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            mensaje: 'save de Usuario!',
            usuario: usuarioGuardado
        });
    } )
});

/**
 * Eliminar un   usuario
 */

app.delete('/:id', mdAutenticacion.verificaToken ,(req, res)=>{
    var id = req.params.id;
    Usuario.findByIdAndRemove(id, (err, usuarioBorrado)=> {
        if ( err ) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al eliminar el usuario!',
                errors: err
            });  
        }

        if( !usuario ){
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe el usuario: ' + id,
                errors: {mensaje: 'NO esiste el usuario'}
            });
        }
        
        return res.status(200).json({
            ok: true,
            mensaje: 'Se borro correctamente: ',
            usuario: usuarioBorrado
        });
        
    });
});


module.exports = app; 