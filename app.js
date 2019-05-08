// Requires
var expless = require('express');
var mongoose = require('mongoose');


//var people = require('./people');
var bodyParser = require('body-parser')




//Inicializar variabres
var app = expless();
//mongoose.Promise = global.Promise;

//Importar rutas
var appRoutes = require('./routes/app');
var usuariosRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())


app.get('/persona',  (req, res)=> {
    res.json(
        {
            name: 'BETO'
        }      
    );
});

app.use('/usuario', usuariosRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes);



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