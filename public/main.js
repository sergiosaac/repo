


var socket = io.connect('http://localhost:3000/', {
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

socket.on('actualizarConectados',function(data){
    $('.salioChateador').html('Se ha desconectado '+data.quienSalio);
    $('.salioChateador').fadeIn();
    setTimeout(function(){ $('.salioChateador').fadeOut(); }, 3000);
        renderNuevoConectado(data);
    });

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
        
        if (elemt == nombre && data.elNuevo != undefined) {
            
            $('.nuevoChateador').html('Se ha conectado '+data.elNuevo);
            $('.nuevoChateador').fadeIn();
            setTimeout(function(){ $('.nuevoChateador').fadeOut(); }, 3000);
            
            $('#username').val(elemt);
            
            numeroAleatorio = Math.floor((Math.random() * 2) + 1)

            var perfiles = ['https://images.vexels.com/media/users/3/140750/isolated/preview/c9b1b66ee3fc60f9bb0aa9a5bee63a9f-perfil-masculino-avatar-2-by-vexels.png',
                            'https://images.vexels.com/media/users/3/140748/isolated/preview/5b078a59390bb4666df98b49f1cdedd0-perfil-avatar-masculino-by-vexels.png',
                            'https://s-media-cache-ak0.pinimg.com/236x/19/87/90/198790eb7e08830027c1ae1686496c72.jpg'];

            $('#avatar').val(perfiles[numeroAleatorio]);

            return;
        }
    });


    var html = conectados.map(function(elemt, index){
        return (
    `<li><a href="#"> <span style="background: rgb(66, 183, 42); border-radius: 50%; display: inline-block; height: 6px; margin-left: 4px; width: 6px;"></span>      ${elemt}</a></li>`);

    }).join(" ");
    
    document.getElementById('listado').innerHTML = html;

}

function render(data) {   
    
    console.log(data);
    $('.escribiendo').fadeOut();

    if (silenciar) {
        
        silenciar = false
    } else {
        audio.play();
    }

    var html = data.map(function(elemt, index){    

        if (elemt.emoticon) { 
            return (
            `<p style="font-size:14px; color:grey;" ><img  height="100" width="100" src="${elemt.url}"><br> <br> <img  height="30" width="30" src="${elemt.avatar}">     by ${elemt.author}</p>
            <hr/>`);
        } else {
            return (
            `<h5> ${elemt.text}</h5>
            
            <p style="float:rigth;font-size:14px; color:grey;" ><img  height="30" width="30" src="${elemt.avatar}">       by ${elemt.author}</p>
            <hr/>`);
        }

    }).join(" ");
    
    document.getElementById('messages').innerHTML = html;

   $("#messages").animate({ scrollTop: $('#messages')[0].scrollHeight}, 1000);   
}

function addMessage(emoticon) {
    
    silenciar = true;


    if (emoticon != undefined ) {
        if ( emoticon.emoticon) {
            socket.emit('nuevoMensaje', emoticon);
            return false;      
        }
    }
    

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

    $("#texto").keypress(function(){
        socket.emit('escribiendo', document.getElementById('username').value);
    });

    for (i = 1; i <= 189; i++) {
        
        var emoticon = `<a href="#"><img class="selecionarEnviarEmoticon" height="25" width="25" src="assets/img/emoticones-smile/Emoji Smiley-${i}.png" alt=""></a>`;
        $('.emoticonesContenedor .grid-content').append(emoticon);
    }

    $('.emoticonesContenedor .grid-content').append("<hr>");

    for (i = 10; i <= 107; i++) {
        
        var emoticon = `<a href="#"><img class="selecionarEnviarEmoticon" height="25" width="25" src="assets/img/emoticones-nature/Emoji Natur-${i}.png" alt=""></a>`;
        $('.emoticonesContenedor .grid-content').append(emoticon);
    }

    $('.emoticonesContenedor .grid-content').append("<hr>");

    for (i = 10; i <= 221; i++) {
        
        var emoticon = `<a href="#"><img class="selecionarEnviarEmoticon" height="25" width="25" src="assets/img/emoticones-objects/Emoji Objects-${i}.png" alt=""></a>`;
        $('.emoticonesContenedor .grid-content').append(emoticon);
    } 

  

    $(".selecionarEnviarEmoticon").click(function(event){       
        event.preventDefault();
        emoticonAEnviar = {};
        emoticonAEnviar.url = $(this).attr('src');
        emoticonAEnviar.emoticon = true;
        emoticonAEnviar.author = document.getElementById('username').value;
        emoticonAEnviar.avatar = document.getElementById('avatar').value;

        $(".emoticonesContenedor").fadeToggle();
        addMessage(emoticonAEnviar);
    }); 

    $(".enviarMensaje").click(function(){
        event.preventDefault();
        addMessage();
    });  
    
    $(".enviarEmoticon").click(function(){
        $(".emoticonesContenedor").fadeToggle();
    });

    $("#texto").focus(function(){
        socket.emit('escribiendo', document.getElementById('username').value);
    });

    $("#texto").blur(function(){
        socket.emit('escribiendoParar', document.getElementById('username').value);
    });    

});