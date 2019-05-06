// Requires
var expless = require('express');
var mongoose = require('mongoose');
//var people = require('./people');



//Inicializar variabres
var app = expless();
//mongoose.Promise = global.Promise;


app.get('/',  (req, res)=> {
    res.json({
        message: 'Hello World!'
    });
});

app.get('/persona',  (req, res)=> {
    res.json(
        {
            name: 'BETO'
        }      
    );
});


//Escuchar peticiones
app.listen(3000, () => {
    console.log('Node/Express: \x1b[36m%s\x1b[0m', 'online'); 
});


// Usamos el método connect para conectarnos a nuestra base de datos
mongoose.connect('mongodb://localhost:27017/hospitalDB')
        .then(() => {
                // Cuando se realiza la conexión, lanzamos este mensaje por consola
        	console.log('La conexión a MongoDB se ha realizado correctamente!!');
        })
        .catch(err => console.log(err));
        // Si no se conecta correctamente escupimos el error