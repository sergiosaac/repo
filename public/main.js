


var socket = io.connect('http://10.9.100.164:3000/', {
    'forceNew':true
});

var nombre = prompt("Escribe tu nombre: ");

var silenciar = false;

if (nombre) {

    socket.emit('nuevoConectado', nombre);

    socket.on('nuevoPersonaje',function(data){
        renderNuevoConectado(data);
    });

} else {
    $('.grid-frame').text('Debes escribir tu nombre para usar el CHAT, recarga la pagina!!');    
}

socket.on('messages',function(data){
    render(data);
});

socket.on('escribiendoCliente',function(nombreEscribiendo){
    if (nombreEscribiendo != document.getElementById('username').value) {
        $('.escribiendo').fadeIn();   
        $('.escribiendo h6').html('<p style="font-size:14px; color:grey;" > Escribiendo '+nombreEscribiendo+'...</p>');     
    }
});

socket.on('escribiendoPararCliente',function(nombreEscribiendo){
    $('.escribiendo').fadeOut();
});

function renderNuevoConectado(data) {
             
       conectados = data.conectados;

       conectados.map(function(elemt, index){
        
        if (elemt == nombre) {
            
            $('.nuevoChateador').html('Se ha conectado '+data.elNuevo);
            $('.nuevoChateador').fadeIn();
            setTimeout(function(){ $('.nuevoChateador').fadeOut(); }, 3000);
            
            $('#username').val(elemt);
            
            numeroAleatorio = Math.floor((Math.random() * 200) + 1)
            $('#avatar').val('https://unsplash.it/'+numeroAleatorio);

            return;
        }
    });


    var html = conectados.map(function(elemt, index){
        return (
    `<li><a href="#">${elemt}</a></li>`);

    }).join(" ");
    
    document.getElementById('listado').innerHTML = html;
}

function render(data) {
    
    $('.escribiendo').fadeOut();

    if (silenciar) {
        
        silenciar = false
    } else {
        audio.play();
    }

    var html = data.map(function(elemt, index){    

    return (
            `<h5> ${elemt.text}</h5>
            
            <p style="font-size:14px; color:grey;" ><img  height="30" width="30" src="${elemt.avatar}">       by ${elemt.author}</p>
            <hr/>`);

            }).join(" ");
    
    document.getElementById('messages').innerHTML = html;

   $("#messages").animate({ scrollTop: $('#messages')[0].scrollHeight}, 1000);   
}

function addMessage() {
    
    silenciar = true;

    var payload = {
        author: document.getElementById('username').value,
        text: document.getElementById('texto').value,
        avatar: document.getElementById('avatar').value
    };
    
    document.getElementById('texto').value = '';
    socket.emit('nuevoMensaje', payload);
    return false;
}

var audio = new Audio('https://notificationsounds.com/notification-sounds/you-wouldnt-believe-510/download/mp3');

$(document).ready(function(){

    // $("#texto").keypress(function(){
    //     socket.emit('escribiendo', document.getElementById('username').value);
    // });
    
    $(".button").click(function(){
        addMessage();
    });

    $("#texto").focus(function(){
        socket.emit('escribiendo', document.getElementById('username').value);
    });

    $("#texto").blur(function(){
        socket.emit('escribiendoParar', document.getElementById('username').value);
    });    

});