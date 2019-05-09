var express = require('express');

var app = express();

var Hospital = require('../models/hospital');
var Medicos = require('../models/medico');
var Usuario = require('../models/usuario');

app.get('/todo/:buscar',  (req, res)=> {
    var buscar = req.params.buscar;

    var regex = new RegExp(buscar, 'i');
    Promise.all( [
        buscarHospitales(buscar, regex), 
        buscarMedicos(buscar, regex),
        buscarUsuarios(buscar, regex)
    ]).then(respuestas=>{
        console.log('respuestas');
        console.log(respuestas);
        return res.json({
            ok: true,
            hospitales: respuestas[0],
            medicos: respuestas[1],
            usuarios: respuestas[2]
        });
    });

});

app.get('/coleccion/:tabla/:buscar', (req, res)=>{
    var buscar = req.params.buscar;
    var tabla = req.params.tabla;
    var regex = new RegExp(buscar, 'i');

    var promesa;

    if(tabla === 'usuarios'){
        promesa =buscarUsuarios(buscar, regex);
    }else if ( tabla === 'medicos') {
        promesa= buscarMedicos(buscar, regex);
    }else if ( tabla === 'hospitales') {
        promesa= buscarHospitales(buscar, regex);
    }else{
        return res.json({
            ok: false,
            mensaje: 'No existe la tabla'
        });
    }

    promesa.then(data=>{
        return res.json({
            ok: true,
            [tabla]: data
        });
    });
});

function buscarHospitales(buscar, regex){
    return new Promise((resolve, reject)=>{
        Hospital.find({nombre: regex})
            .populate('usuario', 'nombre email')
            .exec((err, hospitales)=>{
                if( err ){
                    reject('Error al cargar hospitales: ' + err);
                }
                console.log('Hopitales de la buscqueda');
                console.log(hospitales);
                resolve(hospitales);
            })
        });
}

function buscarMedicos(buscar, regex){
    return new Promise((resolve, reject)=>{
        Medicos.find({nombre: regex})
            .populate('usuario', 'nombre email')
            .populate('hospital')
            .exec((err, medicos)=>{
                if( err ){
                    reject('Error al cargar lo medicos: ' + err);
                }
                console.log('Medicos de la buscqueda');
                console.log(medicos);
                resolve(medicos);
            })
        }
    );
}

function buscarUsuarios(buscar, regex){
    return new Promise((resolve, reject)=>{
        Usuario.find({}, 'nombre email role')
            .or([
                {nombre: regex},
                {email: regex}
            ]).exec((err, usuarios)=>{
                if( err ){
                    reject('Error al cargar lo usuarios: ' + err);
                }
                console.log('usuarios de la buscqueda');
                console.log(usuarios);
                resolve(usuarios);
            });
    });
}
module.exports = app; 