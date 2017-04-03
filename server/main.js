var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var MENSAJES = [{
     id:1,
    text: 'Hola soy un mensaje',
    author: 'Sergio Amarilla'
}];

app.use(express.static('public'));

app.get('/',function(req,res){
    res.status(200).send('Hola nuevamentes');
});

io.on('connection', function(socket){
    console.log('Alguien se conecto con el Socket');
    socket.emit('messages', MENSAJES);

    socket.on('nuevoMensaje', function(data){
        MENSAJES.push(data);
        io.sockets.emit('messages',MENSAJES);
    });
});

server.listen(80, function(){
    console.log('Servidor corriendo en 80');
});
