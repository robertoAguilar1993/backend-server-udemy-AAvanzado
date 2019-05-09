var express = require('express');
var mdAutenticacion = require('../middleware/autenticacion');

var app = express();

var Hospital = require('../models/hospital');

const LIMIT = require('../config/config').LIMIT;


/**
 * Obtener el listado de los hospitales
 */
app.get('/', (req, res)=> {
    console.log('************************* Obtener los hospitales ************************');

    var desde = req.query.desde || 0;
    desde = Number(desde);

    console.log('desde: ' + desde);
    console.log('Limit: ' + LIMIT);

    Hospital.find({ })
        .skip(desde)
        .limit(LIMIT)
        .populate('usuario', 'nombre email')
        .exec((err, hospitales)=>{
            if( err ){
                console.log('************************* Error al obtener los hosputales ************************');
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error: No se pudo obtener los hospitales',
                    error: err
                });
            }
            console.log(hospitales);

            Hospital.count({ },(err, conteo)=>{
                return res.status(200).json({
                    ok: true,
                    mensaje: 'ok',
                    hospitales: hospitales,
                    total: conteo
                });
            }); 
        });
});

/**
 * Guardar un hospital
 */
app.post('/',mdAutenticacion.verificaToken,(req, res)=>{
    var body = req.body;
    console.log('************************* Crear Hospital************************');

    var hospital = new Hospital({
        nombre: body.nombre,
        usuario: req.usuario._id
    });

    hospital.save((err, hospitalGuardado)=> {
        if ( err ) {
            console.log('************************* Error al guardar el hospital ************************');

            return res.status(400).json({
                ok: false,
                mensaje: 'Error: No se pudo guardar el hospital',
                error: err
            });
        }
        console.log('Hospital de la base de datos  body: ');
        console.log(hospitalGuardado);
        return res.status(201).json({
            ok: true,
            mensaje: 'Hospital guardado',
            hospital: hospitalGuardado
        }); 
    });
});

/**
 * Actualizar un Hospital
 */
app.put('/:id',mdAutenticacion.verificaToken,(req, res)=>{
    var id = req.params.id;
    console.log('************************* Actiualizar Hospital ************************');

    Hospital.findById(id, (err, hospital)=> {
        if ( err ) {
            console.log('************************* Error en la base de datos al Buscar el hospital ************************');

            return res.status(500).json({
                ok: false,
                mensaje:'Error al obtener el hospital',
                errors: err
            });
        }

        if ( !hospital ) {
            console.log('************************* No existe el hospital************************');

            return res.status(400).json({
                ok: false,
                mensaje: 'No existe hospital',
                errors: {mensaje: 'No existe hospital'}
            });
        }

        var body = req.body;
        console.log('************************* Info de Actualizar hospital************************');


        hospital.nombre = body.nombre;
        hospital.usuario = req.usuario._id;

        console.log(hospital);
        hospital.save((err, hospitalUpdate)=> {
            if ( err ) {
                console.log('************************* Error al actualizar el hospital************************');

                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error, No se pudo actualizar el Hospital',
                    errors: err
                });
            }
            console.log('hospital Actualizado');
            console.log(hospitalUpdate);
            res.status(200).json({
                ok: true,
                mensaje: 'Hospital Actualizado!',
                usuario: hospitalUpdate
            });
            
        });

    });
});

/**
 * Eliminar hospital
 */
app.delete('/:id', mdAutenticacion.verificaToken,(req, res)=>{
    console.log('************************* Eliminar hospital************************');

    var id = req.params.id;

    Hospital.findByIdAndRemove(id, (err, hospitalBorrado)=> {
        if ( err ) {
            console.log('************************* Error al eliminar el hsopital ************************');

            return res.status(500).json({
                ok: false,
                mensaje: 'Error al eliminar el Hospital!',
                errors: err
            }); 
        }
        if( !hospitalBorrado ){
            console.log('************************* No existe el hospital ************************');

            return res.status(400).json({
                ok: false,
                mensaje: 'No existe el hospital: ' + id,
                errors: {mensaje: 'NO esiste el hospital'}
            });
        }
        console.log('************************* Info hospital ************************');
        console.log(hospitalBorrado);
        return res.status(200).json({
            ok: true,
            mensaje: 'Se borro correctamente: ',
            hospital: hospitalBorrado
        });
    });
});


module.exports = app;