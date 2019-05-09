var express = require('express');

var app = express();

const path = require('path');
const fs = require('fs');



app.get('/:tipo/:img',  (req, res)=> {

    var tipo = req.params.tipo;
    var img = req.params.img;

    //tipos de coleccion
    var tiposValidos = ['hospitales', 'medicos','usuarios'];

    if ( tiposValidos.indexOf( tipo ) < 0 ) {
        return res.status(400).json({
            ok: false,
            mensaje: 'El tipo coleccion no es valido!',
            errors: {mensaje: 'Las colecciones validas son: ' + tiposValidos.join(', ')}
        });
    }

    var nombrePath = path.resolve( __dirname, `../uploads/${ tipo }/${ img }` );

    if ( fs.existsSync( nombrePath ) ) {
        res.sendFile( nombrePath );
    } else {
        var imagenDefault = path.resolve(__dirname, `../assets/no-img.jpg`)
        res.sendFile( imagenDefault );
    }
});

module.exports = app; 