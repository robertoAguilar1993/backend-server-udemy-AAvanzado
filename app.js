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
var hospitalRoutes = require('./routes/hospital');
var medicoRoutes = require('./routes/medico');
var busquedaRoutes = require('./routes/busqueda');
var uploadRoutes = require('./routes/upload');
var imagenesRoutes = require('./routes/imagenes');



// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())
app.use('/usuario', usuariosRoutes);
app.use('/login', loginRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/medico', medicoRoutes);
app.use('/busqueda',busquedaRoutes);
app.use('/upload', uploadRoutes);
app.use('/img', imagenesRoutes);


//Esta ruta debe ir al final
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