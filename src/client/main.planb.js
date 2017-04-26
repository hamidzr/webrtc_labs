const getUserMedia = require('getusermedia');
const Peer = require('simple-peer');

let KEYVALUE_SERVER = 'https://gr.itguy.ir:9443';
let roomName = getParameterByName('r');
console.log('welcome to room' , roomName);
let myId,otherId,peer,myRole,otherRole;


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

function setup(isInitiator){
  myRole = isInitiator ? 'a' : 'b';
  otherRole = isInitiator ? 'b' : 'a';
  getUserMedia({ video: false, audio: true }, function (err, stream) {
    if (err) return console.error(err);
    peer = new Peer({
      initiator: isInitiator,
      trickle: false,
      stream: stream
    });
    peer.on('signal', function (data) {
      $.ajax({
        url: KEYVALUE_SERVER + '/kv/v1/keys',
        method: 'POST',
        data: {
          key: roomName + '-' + myRole ,
          val: JSON.stringify(data)
        }
      })
      // document.getElementById('yourId').value = JSON.stringify(data)
    })

    document.getElementById('connect').addEventListener('click', function () {
        console.log('going to connect to role',otherRole);
      if(otherId){ 
        console.log('signaling role',otherRole);
        peer.signal(otherId);
      }else{
        console.log('we dont have otherId so going to call');
        $.ajax({ // there is no otherID 
          url: KEYVALUE_SERVER + `/kv/v1/keys/${roomName}-${otherRole}`,
          method: 'GET',
          success: function(data){
            console.log('signaling role',otherRole);
            peer.signal(data);
          },
          error: err =>{
            console.log('failed to get roleID ',otherRole);
          }
        })
      }
      
    })

    document.getElementById('send').addEventListener('click', function () {
      let yourMessage = document.getElementById('yourMessage').value;
      peer.send(yourMessage);
    })

    peer.on('data', function (data) {
      document.getElementById('messages').textContent += data + '\n';
    })

    peer.on('stream', function (stream) {
      let video = document.createElement('video');
      document.body.appendChild(video)

      video.src = window.URL.createObjectURL(stream)
      video.play()
    })
  })
}


let getOtherId = $.ajax({
  url: KEYVALUE_SERVER + `/kv/v1/keys/${roomName}-a`,
  method: 'GET'
})
getOtherId.fail(err => {
  // you are the first one. initiate!
  console.log('other side is not setup yet');
  setup(true);
});
getOtherId.done(data => {
  // someone else is already here. ( or didn't cleanup after leaving )
  console.log('otherId is ',data);
  otherId = data;
  setup(false);
})

$('button#reset').on('click', e => {
  $.ajax({
    url: KEYVALUE_SERVER + `/kv/v1/keys/${roomName}-${myRole}`,
    type: 'DELETE'
  })
  $.ajax({
    url: KEYVALUE_SERVER + `/kv/v1/keys/${roomName}-${otherRole}`,
    type: 'DELETE'
  })
})