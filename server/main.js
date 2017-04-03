var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var fs = require('fs');

var MENSAJES = [{
    
    id:1,
    text: '',
    author: 'Bienvenido al Chats!',
    avatar: 'https://techjoomla.com/cache/com_zoo/images/jbolo_c87c36c385f9008f61c1a889c50fb037.png'
}];

var conectados = [];

app.use(express.static('public'));

app.get('/',function(req,res){
    res.status(200).send('Hola nuevamentes');
});

io.on('connection', function(socket){
    
    socket.on('nuevoConectado', function(nuevo){
        conectados.push(nuevo);
        io.sockets.emit('nuevoPersonaje',conectados);
        socket.usuario = nuevo;
    });
    
    socket.emit('messages', MENSAJES);

    socket.on('nuevoMensaje', function(data){
        MENSAJES.push(data);
        io.sockets.emit('messages',MENSAJES);

        MENSAJES.map(function(elemt, index){
            console.log(elemt);
            var stream = fs.createWriteStream("./test.txt");
                stream.once('open', function(fd) {
                stream.write(elemt.text);
                
            });
            
        });

    });


    //cuando el usuario cierra o actualiza el navegador
	socket.on("disconnect", function()
	{
        removeItemFromArr( conectados, socket.usuario );   	
	});

});

//helpers


function removeItemFromArr ( arr, item ) {
    var i = arr.indexOf( item );

    if ( i !== -1 ) {
        arr.splice( i, 1 );
    }
}


server.listen(3000, function(){
    console.log('Servidor corriendo en 3000');
});
