var express = require('express');
var mdAutenticacion = require('../middleware/autenticacion');

var Medico = require('../models/medico');

var app = express();

const LIMIT = require('../config/config').LIMIT;


/**
 * Obtener los medicos
 */
app.get('/', (req, res)=>{
    console.log('************************* Obtener Medicos ************************');
    
    var desde = req.query.desde || 0;
    desde = Number(desde);

    console.log('desde: ' + desde);
    console.log('Limit: ' + LIMIT);
    
    Medico.find({})
        .skip(desde)
        .limit(LIMIT)
        .populate('usuario', 'nombre email')
        .populate('hospital')
        .exec((err, medicos)=>{
            if( err){
                console.log('************************* Error al obtener los medicos ************************');

                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error en base de datos, cargando medicos!',
                    errors: err
                });
            }
            console.log(medicos);

            Medico.count({ },(err, conteo)=>{
                return res.status(200).json({
                    ok: true,
                    mensaje: 'ok',
                    medicos: medicos,
                    total: conteo
                });
            });
        });
});

/**
 * Crear hospital
 */
app.post('/',mdAutenticacion.verificaToken ,(req, res)=>{
    console.log('************************* Crear Medico************************');
    var body = req.body;
    console.log('medico');
    console.log(body);
    console.log('medico body; ');
    console.log(body);
    var medico = new Medico({
        nombre: body.nombre,
        usuario: req.usuario._id,
        hospital: body.idHospital
    });


    medico.save((err, medicoGuardado)=>{
        if ( err ) {
            console.log('************************* Error al guardar el medico************************');
            return res.status(500).json({
                ok: false,
                mensaje: 'Error en base de datos, crear medico!',
                errors: err
            });
        }
        console.log('Medico DB body: ');
        console.log(medicoGuardado);
        return res.status(201).json({
            ok: true,
            mensaje: 'Medico creado',
            medico: medicoGuardado
        });
    });

});

/**
 * Actualiazar el medico
 */
app.put('/:id',mdAutenticacion.verificaToken ,(req, res)=>{
    var id= req.params.id;
    console.log('************************* Actiualizar Medico************************');
    console.log('id');
    console.log(id);

    Medico.findById(id, (err, medico)=>{
        if ( err ) {
            console.log('************************* Error en la base de datos al Buscar el medico ************************');
            return res.status(500).json({
                ok: false,
                mensaje: 'Error en base de datos, Buscar el  medico!',
                errors: err
            });
        }

        if ( !medico ) {
            console.log('************************* No existe el Medico************************');
            return res.status(401).json({
                ok: false,
                mensaje: 'No existe el medico: ' + id,
                errors: {mensaje: 'No existe el medico'}
            });
        }

        console.log('************************* Info de Actualizar Medico************************');
        var body = req.body;
        medico.nombre = body.nombre;
        medico.usuario = req.usuario._id;
        medico.hospital = body.idHospital;

        console.log(medico);

        medico.save((err, medicoActualizado)=>{
            if ( err ) {
                console.log('************************* Error al actualizar el medico************************');
                return res.status(401).json({
                    ok: false,
                    mensaje: 'Error en base de datos, Actulizar el  medico!',
                    errors: err
                });
            }
            console.log('medicoActualizado');
            console.log(medicoActualizado);
            return res.status(200).json({
                ok: true,
                mensaje: 'ok!',
                medico: medicoActualizado
            });

        });
    });
});


/**
 * Elimina un medico
 */
app.delete('/:id',mdAutenticacion.verificaToken ,(req, res)=>{
    var id= req.params.id;
    console.log('************************* Eliminar Medico************************');
    console.log('id');
    console.log(id);
    Medico.findByIdAndRemove(id, (err, medico)=>{
        if ( err ) {
            console.log('************************* Error al eliminar el medico ************************');
            return res.status(500).json({
                ok: false,
                mensaje: 'Error en base de datos, Buscar el  medico!',
                errors: err
            });
        }

        if ( !medico ) {
            console.log('************************* No existe el medico ************************');
            return res.status(401).json({
                ok: false,
                mensaje: 'No existe el medico: ' + id,
                errors: {mensaje: 'No existe el medico'}
            });
        }
        console.log('************************* Info Medico ************************');
        console.log(medico);
        return res.status(200).json({
            ok: true,
            mensaje: 'ok!',
            medico: medico
        });

    });

});

module.exports = app;