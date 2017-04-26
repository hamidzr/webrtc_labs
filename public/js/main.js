webpackJsonp([0],{

/***/ 19:
/***/ (function(module, exports, __webpack_require__) {

const getUserMedia = __webpack_require__(7);
const Peer = __webpack_require__(8);

let SERVER_ADDRESS = 'https://gr.itguy.ir:9443';
let roomName = getParameterByName('r');
console.log('welcome to room', roomName);
let peer;

console.log(io);
var socket = io(SERVER_ADDRESS);
socket.on('connect', function () {
  console.log('Connected to socket');
});

function getParameterByName(name, url) {
  if (!url) {
    url = window.location.href;
  }
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function watchForData(peer) {
  document.getElementById('send').addEventListener('click', function () {
    let yourMessage = document.getElementById('yourMessage').value;
    peer.send(yourMessage);
  });

  peer.on('data', function (data) {
    document.getElementById('messages').textContent += data + '\n';
  });

  peer.on('stream', function (stream) {
    let video = document.createElement('video');
    document.body.appendChild(video);

    video.src = window.URL.createObjectURL(stream);
    video.play();
  });
};

getUserMedia({ video: false, audio: true }, function (err, stream) {
  if (err) return console.error(err);

  socket.emit('sig:ready', roomName);
  console.log('sent ready');

  socket.on('sig:init', function () {
    console.log('got init');
    peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream
    });
    peer.on('signal', function (data) {
      socket.emit('sig:offer', JSON.stringify(data));
      console.log('sent offer', data);
    });
  });

  socket.on('sig:accept', function (accept) {
    accept = JSON.parse(accept);
    peer.signal(accept);
    console.log('got accept', accept);
    watchForData(peer);
  });

  socket.on('sig:offer', function (offer) {
    offer = JSON.parse(offer);
    console.log('got offer', offer);
    peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream
    });
    peer.on('signal', function (data) {
      socket.emit('sig:accept', JSON.stringify(data));
      console.log('sent accept', data);
    });
    peer.signal(offer);
    watchForData(peer);
  });

  // document.getElementById('connect').addEventListener('click', function () {
  //     console.log('going to connect to role',otherRole);
  //   if(otherId){ 
  //     console.log('signaling role',otherRole);
  //     peer.signal(otherId);
  //   }else{
  //     console.log('we dont have otherId so going to call');
  //     $.ajax({ // there is no otherID 
  //       url: SERVER_ADDRESS + `/kv/v1/keys/${roomName}-${otherRole}`,
  //       method: 'GET',
  //       success: function(data){
  //         console.log('signaling role',otherRole);
  //         peer.signal(data);
  //       },
  //       error: err =>{
  //         console.log('failed to get roleID ',otherRole);
  //       }
  //     })
  //   }

  // })

}); // end of getUserMedia


// function setup(isInitiator){
//   myRole = isInitiator ? 'a' : 'b';
//   otherRole = isInitiator ? 'b' : 'a';

// }


// let getOtherId = $.ajax({
//   url: SERVER_ADDRESS + `/kv/v1/keys/${roomName}-a`,
//   method: 'GET'
// })
// getOtherId.fail(err => {
//   // you are the first one. initiate!
//   console.log('other side is not setup yet');
//   setup(true);
// });
// getOtherId.done(data => {
//   // someone else is already here. ( or didn't cleanup after leaving )
//   console.log('otherId is ',data);
//   otherId = data;
//   setup(false);
// })

// $('button#reset').on('click', e => {
//   $.ajax({
//     url: SERVER_ADDRESS + `/kv/v1/keys/${roomName}-${myRole}`,
//     type: 'DELETE'
//   })
//   $.ajax({
//     url: SERVER_ADDRESS + `/kv/v1/keys/${roomName}-${otherRole}`,
//     type: 'DELETE'
//   })
// })

/***/ })

},[19]);
//# sourceMappingURL=main.map