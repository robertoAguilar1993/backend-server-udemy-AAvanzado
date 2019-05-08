var express = require('express');

var app = express();



app.get('/',  (req, res)=> {
    res.json({
        message: 'Hello World!'
    });
});

module.exports = app; 