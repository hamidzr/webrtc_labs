const getUserMedia = require('getusermedia');
const Peer = require('simple-peer');

// let SERVER_ADDRESS = 'https://gr.itguy.ir:9443';
let SERVER_ADDRESS = 'http://localhost:9080';
let roomName = getParameterByName('r');
var peer, socket;



// helpers
// pre: url and parameter name
// post: returns parameter value
function getParameterByName(name, url) {
    if (!url) {
      url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return null;
    return convertToSlug(decodeURIComponent(results[2].toLowerCase().replace(/\+/g, " ")));
}

// converts string to one word
function convertToSlug(Text)
{
    return Text
        .toLowerCase()
        .replace(/[^\w ]+/g,'')
        .replace(/ +/g,'-')
        ;
}

// populate the room name if available
if (roomName != null) {
  document.getElementById('room').setAttribute("value",roomName)
}



// setup the communication when form is submitted
document.getElementById('setup').addEventListener('submit', e => {
  e.preventDefault();
  roomName = document.getElementById('room').value.toLowerCase();
  if (roomName.length > 1) {
    let options = {
      audio: document.getElementById('audio').checked,
      video: document.getElementById('video').checked
    };
    start(options);
    document.querySelector('h2').textContent = 'Welcome to room: ' + roomName;
  }else{
    alert('Enter a room name!');
  };
});

document.getElementById('reset').addEventListener('click', e => {
  console.log('resetting the room');
  socket.emit('sig:reset');
  peer.destroy();
});


// function cleanRoom(socket){
//   socket.emit('sig:clean')
// }

function watchForPeer(){
  document.getElementById('send').disabled = false;
  document.getElementById('chat').addEventListener('submit', function (e) {
    e.preventDefault();    
    let yourMessage = document.getElementById('yourMessage');
    peer.send(yourMessage.value);
    document.getElementById('messages').textContent += yourMessage.value + '\n';
    yourMessage.value = null;

  })

  peer.on('data', function (data) {
    document.getElementById('messages').textContent += data + '\n';
  })

  peer.on('stream', function (stream) {
    let player = document.getElementById('player');

    player.src = window.URL.createObjectURL(stream)
    player.play()
  })

  peer.on('close', ()=>{
    console.log('Peer died');
    // let the user know that peer died and take action
    alert('Peer is gone.');
  })
};


function start(options){

  // connect to main socket server
  socket = io(SERVER_ADDRESS);
  socket.on('connect', function(){
    console.log('Connected to socket');
  });

  console.log('welcome to room' , roomName);

  getUserMedia(options, function (err, stream) {
    if (err) return console.error(err);

    socket.emit('sig:ready',roomName);
    console.log('sent ready');

    socket.on('sig:init',function(){
      console.log('got init');
      peer = new Peer({
        initiator: true,
        trickle: false,
        stream: stream
      });
      peer.on('signal', function (data) {
        socket.emit('sig:offer', JSON.stringify(data));
        console.log('sent offer', data);     
      })
    });


    socket.on('sig:accept', function(accept){
      accept = JSON.parse(accept);
      peer.signal(accept);
      console.log('got accept',accept);
      watchForPeer();
    });


    socket.on('sig:offer', function(offer){
      offer = JSON.parse(offer);
      console.log('got offer',offer);
      peer = new Peer({
        initiator: false,
        trickle: false,
        stream: stream
      });
      peer.on('signal', function (data) {
        socket.emit('sig:accept', JSON.stringify(data));
        console.log('sent accept', data);     
      })
      peer.signal(offer);
      watchForPeer();
    });


  }); // end of getUserMedia

}
