var express = require('express');
var fileUpload = require('express-fileupload');
var fs = require('fs');

var app = express();
app.use(fileUpload());


var Usuario = require('../models/usuario');
var Hospital = require('../models/hospital');
var Medico = require('../models/medico');



/**
 * Actualiza la imagen segun el tipo
 */
app.put('/:tipo/:id',  (req, res)=> {

    var tipo = req.params.tipo;
    var id= req.params.id;

    //tipos de coleccion
    var tiposValidos = ['hospitales', 'medicos','usuarios'];

    if ( tiposValidos.indexOf( tipo ) < 0 ) {
        return res.status(400).json({
            ok: false,
            mensaje: 'El tipo coleccion no es valido!',
            errors: {mensaje: 'Las colecciones validas son: ' + tiposValidos.join(', ')}
        });
    }

    if ( !req.files ) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No selecciono archivo!',
            errors: {mensaje: 'Debe de seleccionar un archivo'}
        });
    } 

    //Obtener archivo
    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extencionArchivo = nombreCortado[nombreCortado.length -1];

    //solo estas extenciones aceptamos
    var extencionesValidas=['png', 'jpg', 'gif', 'jpeg'];

    if ( extencionesValidas.indexOf(extencionArchivo) < 0 ) {
        return res.status(400).json({
            ok: false,
            mensaje: 'La extención del archivo no es valida!',
            errors: {mensaje: 'Las extenciones validas: ' + extencionesValidas.join(', ')}
        });
    }

    //Creando nombre de archivo personalizado
    var nombreArchivo = `${ id }-${ new Date().getMilliseconds()}.${extencionArchivo}`;


    //Mover el archivo temporal al path
    var path = `./uploads/${tipo}/${nombreArchivo}`; 

    archivo.mv(path,  err=>{
        if ( err ) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover archivo!',
                errors: err
            });
        }

        subirPorTipo(tipo, id, nombreArchivo, res);
    });
});

function subirPorTipo(tipo, id,nombreArchivo , res){

    if ( tipo ===  'hospitales') {
        Hospital.findById(id, (err, hospital)=>{

            if ( !hospital ) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El hospital no existe',
                    errors: {mensaje: 'El hospital no existe'} 
                });
            }
            var pathViejo = './uploads/hospitales/' + usuario.img;

            //Si existe elimina la imagen anterios
            if ( fs.existsSync( pathViejo ) ) {
                fs.unlink( pathViejo );
            }

            hospital.img = nombreArchivo;
            hospital.save((err, hospitalActualizado)=>{
                hospitalActualizado.password = ':)';
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen del hospital fue Actualizado',
                    hospital: hospitalActualizado
                });
            })
        });
    }

    if ( tipo ===  'medicos') {
        Medico.findById(id, (err, medico)=>{

            if ( !medico ) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El medico no existe',
                    errors: {mensaje: 'El medico no existe'}
                });
            }

            var pathViejo = './uploads/medicos/' + usuario.img;

            //Si existe elimina la imagen anterios
            if ( fs.existsSync( pathViejo ) ) {
                fs.unlink( pathViejo );
            }

            medico.img = nombreArchivo;
            medico.save((err, medicoActualizado)=>{
                medicoActualizado.password = ':)';
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen del medico esta Actualizado',
                    medico: medicoActualizado
                });
            })
        });
    }

    if ( tipo ===  'usuarios') {
        Usuario.findById(id, (err, usuario)=>{

            if ( !usuario ) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El usuario no existe',
                    errors: {mensaje: 'El usuario no existe'}
                });
            }

            var pathViejo = './uploads/usuarios/' + usuario.img;

            //Si existe elimina la imagen anterios
            if ( fs.existsSync( pathViejo ) ) {
                fs.unlink( pathViejo );
            }

            usuario.img = nombreArchivo;
            usuario.save((err, usuarioDB)=>{
                usuarioDB.password = ':)';
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen del Usuario Actualizado',
                    usuario: usuarioDB
                });
            })
        });
    }
}
/*
var serveIndex = require('serve-index');
app.use(express.static(__dirname + '/'))
app.use('/uploads', serveIndex(__dirname + '/uploads'));
*/
module.exports = app; 