var socket = io.connect('http://54.69.189.35/:80/', {
    'forceNew':true
});

socket.on('messages',function(data){
    console.log(data);
    render(data);
});

function render(data) {
    var html = data.map(function(elemt, index){
        return (
    `<div>
        <strong>${elemt.author}</strong>:
        <em>${elemt.text}</em>    
    <div>`);
    }).join(" ");
    
    document.getElementById('messages').innerHTML = html;
}

function addMessage() {
    var payload = {
        author: document.getElementById('username').value,
        text: document.getElementById('texto').value
    };

    socket.emit('nuevoMensaje', payload);
    return false;
}