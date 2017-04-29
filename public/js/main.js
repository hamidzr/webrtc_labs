webpackJsonp([0],{

/***/ 19:
/* unknown exports provided */
/* all exports used */
/*!*****************!*\
  !*** ./main.js ***!
  \*****************/
/***/ (function(module, exports, __webpack_require__) {

eval("const getUserMedia = __webpack_require__(/*! getusermedia */ 7);\nconst Peer = __webpack_require__(/*! simple-peer */ 8);\n\n// let SERVER_ADDRESS = 'https://gr.itguy.ir:9443';\nlet SERVER_ADDRESS = 'http://localhost:9080';\nlet roomName = getParameterByName('r');\nvar peer, socket;\n\n// helpers\n// pre: url and parameter name\n// post: returns parameter value\nfunction getParameterByName(name, url) {\n  if (!url) {\n    url = window.location.href;\n  }\n  name = name.replace(/[\\[\\]]/g, \"\\\\$&\");\n  var regex = new RegExp(\"[?&]\" + name + \"(=([^&#]*)|&|#|$)\"),\n      results = regex.exec(url);\n  if (!results) return null;\n  if (!results[2]) return null;\n  return convertToSlug(decodeURIComponent(results[2].toLowerCase().replace(/\\+/g, \" \")));\n}\n\n// converts string to one word\nfunction convertToSlug(Text) {\n  return Text.toLowerCase().replace(/[^\\w ]+/g, '').replace(/ +/g, '-');\n}\n\n// populate the room name if available\nif (roomName != null) {\n  document.getElementById('room').setAttribute(\"value\", roomName);\n}\n\n// setup the communication when form is submitted\ndocument.getElementById('setup').addEventListener('submit', e => {\n  e.preventDefault();\n  roomName = document.getElementById('room').value.toLowerCase();\n  if (roomName.length > 1) {\n    let options = {\n      audio: document.getElementById('audio').checked,\n      video: document.getElementById('video').checked\n    };\n    start(options);\n    document.querySelector('h2').textContent = 'Welcome to room: ' + roomName;\n  } else {\n    alert('Enter a room name!');\n  };\n});\n\ndocument.getElementById('reset').addEventListener('click', e => {\n  console.log('resetting the room');\n  socket.emit('sig:reset');\n  peer.destroy();\n});\n\n// function cleanRoom(socket){\n//   socket.emit('sig:clean')\n// }\n\nfunction watchForPeer() {\n  document.getElementById('send').disabled = false;\n  document.getElementById('chat').addEventListener('submit', function (e) {\n    e.preventDefault();\n    let yourMessage = document.getElementById('yourMessage');\n    peer.send(yourMessage.value);\n    document.getElementById('messages').textContent += yourMessage.value + '\\n';\n    yourMessage.value = null;\n  });\n\n  peer.on('data', function (data) {\n    document.getElementById('messages').textContent += data + '\\n';\n  });\n\n  peer.on('stream', function (stream) {\n    let player = document.getElementById('player');\n\n    player.src = window.URL.createObjectURL(stream);\n    player.play();\n  });\n\n  peer.on('close', () => {\n    console.log('Peer died');\n    // let the user know that peer died and take action\n    alert('Peer is gone.');\n  });\n};\n\nfunction start(options) {\n\n  // connect to main socket server\n  socket = io(SERVER_ADDRESS);\n  socket.on('connect', function () {\n    console.log('Connected to socket');\n  });\n\n  console.log('welcome to room', roomName);\n\n  getUserMedia(options, function (err, stream) {\n    if (err) return console.error(err);\n\n    socket.emit('sig:ready', roomName);\n    console.log('sent ready');\n\n    socket.on('sig:init', function () {\n      console.log('got init');\n      peer = new Peer({\n        initiator: true,\n        trickle: false,\n        stream: stream\n      });\n      peer.on('signal', function (data) {\n        socket.emit('sig:offer', JSON.stringify(data));\n        console.log('sent offer', data);\n      });\n    });\n\n    socket.on('sig:accept', function (accept) {\n      accept = JSON.parse(accept);\n      peer.signal(accept);\n      console.log('got accept', accept);\n      watchForPeer();\n    });\n\n    socket.on('sig:offer', function (offer) {\n      offer = JSON.parse(offer);\n      console.log('got offer', offer);\n      peer = new Peer({\n        initiator: false,\n        trickle: false,\n        stream: stream\n      });\n      peer.on('signal', function (data) {\n        socket.emit('sig:accept', JSON.stringify(data));\n        console.log('sent accept', data);\n      });\n      peer.signal(offer);\n      watchForPeer();\n    });\n  }); // end of getUserMedia\n}//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMTkuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vc3JjL2NsaWVudC9tYWluLmpzPzlhMzIiXSwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgZ2V0VXNlck1lZGlhID0gcmVxdWlyZSgnZ2V0dXNlcm1lZGlhJyk7XG5jb25zdCBQZWVyID0gcmVxdWlyZSgnc2ltcGxlLXBlZXInKTtcblxuLy8gbGV0IFNFUlZFUl9BRERSRVNTID0gJ2h0dHBzOi8vZ3IuaXRndXkuaXI6OTQ0Myc7XG5sZXQgU0VSVkVSX0FERFJFU1MgPSAnaHR0cDovL2xvY2FsaG9zdDo5MDgwJztcbmxldCByb29tTmFtZSA9IGdldFBhcmFtZXRlckJ5TmFtZSgncicpO1xudmFyIHBlZXIsIHNvY2tldDtcblxuXG5cbi8vIGhlbHBlcnNcbi8vIHByZTogdXJsIGFuZCBwYXJhbWV0ZXIgbmFtZVxuLy8gcG9zdDogcmV0dXJucyBwYXJhbWV0ZXIgdmFsdWVcbmZ1bmN0aW9uIGdldFBhcmFtZXRlckJ5TmFtZShuYW1lLCB1cmwpIHtcbiAgICBpZiAoIXVybCkge1xuICAgICAgdXJsID0gd2luZG93LmxvY2F0aW9uLmhyZWY7XG4gICAgfVxuICAgIG5hbWUgPSBuYW1lLnJlcGxhY2UoL1tcXFtcXF1dL2csIFwiXFxcXCQmXCIpO1xuICAgIHZhciByZWdleCA9IG5ldyBSZWdFeHAoXCJbPyZdXCIgKyBuYW1lICsgXCIoPShbXiYjXSopfCZ8I3wkKVwiKSxcbiAgICAgICAgcmVzdWx0cyA9IHJlZ2V4LmV4ZWModXJsKTtcbiAgICBpZiAoIXJlc3VsdHMpIHJldHVybiBudWxsO1xuICAgIGlmICghcmVzdWx0c1syXSkgcmV0dXJuIG51bGw7XG4gICAgcmV0dXJuIGNvbnZlcnRUb1NsdWcoZGVjb2RlVVJJQ29tcG9uZW50KHJlc3VsdHNbMl0udG9Mb3dlckNhc2UoKS5yZXBsYWNlKC9cXCsvZywgXCIgXCIpKSk7XG59XG5cbi8vIGNvbnZlcnRzIHN0cmluZyB0byBvbmUgd29yZFxuZnVuY3Rpb24gY29udmVydFRvU2x1ZyhUZXh0KVxue1xuICAgIHJldHVybiBUZXh0XG4gICAgICAgIC50b0xvd2VyQ2FzZSgpXG4gICAgICAgIC5yZXBsYWNlKC9bXlxcdyBdKy9nLCcnKVxuICAgICAgICAucmVwbGFjZSgvICsvZywnLScpXG4gICAgICAgIDtcbn1cblxuLy8gcG9wdWxhdGUgdGhlIHJvb20gbmFtZSBpZiBhdmFpbGFibGVcbmlmIChyb29tTmFtZSAhPSBudWxsKSB7XG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyb29tJykuc2V0QXR0cmlidXRlKFwidmFsdWVcIixyb29tTmFtZSlcbn1cblxuXG5cbi8vIHNldHVwIHRoZSBjb21tdW5pY2F0aW9uIHdoZW4gZm9ybSBpcyBzdWJtaXR0ZWRcbmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzZXR1cCcpLmFkZEV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsIGUgPT4ge1xuICBlLnByZXZlbnREZWZhdWx0KCk7XG4gIHJvb21OYW1lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jvb20nKS52YWx1ZS50b0xvd2VyQ2FzZSgpO1xuICBpZiAocm9vbU5hbWUubGVuZ3RoID4gMSkge1xuICAgIGxldCBvcHRpb25zID0ge1xuICAgICAgYXVkaW86IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhdWRpbycpLmNoZWNrZWQsXG4gICAgICB2aWRlbzogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3ZpZGVvJykuY2hlY2tlZFxuICAgIH07XG4gICAgc3RhcnQob3B0aW9ucyk7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignaDInKS50ZXh0Q29udGVudCA9ICdXZWxjb21lIHRvIHJvb206ICcgKyByb29tTmFtZTtcbiAgfWVsc2V7XG4gICAgYWxlcnQoJ0VudGVyIGEgcm9vbSBuYW1lIScpO1xuICB9O1xufSk7XG5cbmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXNldCcpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZSA9PiB7XG4gIGNvbnNvbGUubG9nKCdyZXNldHRpbmcgdGhlIHJvb20nKTtcbiAgc29ja2V0LmVtaXQoJ3NpZzpyZXNldCcpO1xuICBwZWVyLmRlc3Ryb3koKTtcbn0pO1xuXG5cbi8vIGZ1bmN0aW9uIGNsZWFuUm9vbShzb2NrZXQpe1xuLy8gICBzb2NrZXQuZW1pdCgnc2lnOmNsZWFuJylcbi8vIH1cblxuZnVuY3Rpb24gd2F0Y2hGb3JQZWVyKCl7XG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzZW5kJykuZGlzYWJsZWQgPSBmYWxzZTtcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NoYXQnKS5hZGRFdmVudExpc3RlbmVyKCdzdWJtaXQnLCBmdW5jdGlvbiAoZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTsgICAgXG4gICAgbGV0IHlvdXJNZXNzYWdlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3lvdXJNZXNzYWdlJyk7XG4gICAgcGVlci5zZW5kKHlvdXJNZXNzYWdlLnZhbHVlKTtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWVzc2FnZXMnKS50ZXh0Q29udGVudCArPSB5b3VyTWVzc2FnZS52YWx1ZSArICdcXG4nO1xuICAgIHlvdXJNZXNzYWdlLnZhbHVlID0gbnVsbDtcblxuICB9KVxuXG4gIHBlZXIub24oJ2RhdGEnLCBmdW5jdGlvbiAoZGF0YSkge1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtZXNzYWdlcycpLnRleHRDb250ZW50ICs9IGRhdGEgKyAnXFxuJztcbiAgfSlcblxuICBwZWVyLm9uKCdzdHJlYW0nLCBmdW5jdGlvbiAoc3RyZWFtKSB7XG4gICAgbGV0IHBsYXllciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwbGF5ZXInKTtcblxuICAgIHBsYXllci5zcmMgPSB3aW5kb3cuVVJMLmNyZWF0ZU9iamVjdFVSTChzdHJlYW0pXG4gICAgcGxheWVyLnBsYXkoKVxuICB9KVxuXG4gIHBlZXIub24oJ2Nsb3NlJywgKCk9PntcbiAgICBjb25zb2xlLmxvZygnUGVlciBkaWVkJyk7XG4gICAgLy8gbGV0IHRoZSB1c2VyIGtub3cgdGhhdCBwZWVyIGRpZWQgYW5kIHRha2UgYWN0aW9uXG4gICAgYWxlcnQoJ1BlZXIgaXMgZ29uZS4nKTtcbiAgfSlcbn07XG5cblxuZnVuY3Rpb24gc3RhcnQob3B0aW9ucyl7XG5cbiAgLy8gY29ubmVjdCB0byBtYWluIHNvY2tldCBzZXJ2ZXJcbiAgc29ja2V0ID0gaW8oU0VSVkVSX0FERFJFU1MpO1xuICBzb2NrZXQub24oJ2Nvbm5lY3QnLCBmdW5jdGlvbigpe1xuICAgIGNvbnNvbGUubG9nKCdDb25uZWN0ZWQgdG8gc29ja2V0Jyk7XG4gIH0pO1xuXG4gIGNvbnNvbGUubG9nKCd3ZWxjb21lIHRvIHJvb20nICwgcm9vbU5hbWUpO1xuXG4gIGdldFVzZXJNZWRpYShvcHRpb25zLCBmdW5jdGlvbiAoZXJyLCBzdHJlYW0pIHtcbiAgICBpZiAoZXJyKSByZXR1cm4gY29uc29sZS5lcnJvcihlcnIpO1xuXG4gICAgc29ja2V0LmVtaXQoJ3NpZzpyZWFkeScscm9vbU5hbWUpO1xuICAgIGNvbnNvbGUubG9nKCdzZW50IHJlYWR5Jyk7XG5cbiAgICBzb2NrZXQub24oJ3NpZzppbml0JyxmdW5jdGlvbigpe1xuICAgICAgY29uc29sZS5sb2coJ2dvdCBpbml0Jyk7XG4gICAgICBwZWVyID0gbmV3IFBlZXIoe1xuICAgICAgICBpbml0aWF0b3I6IHRydWUsXG4gICAgICAgIHRyaWNrbGU6IGZhbHNlLFxuICAgICAgICBzdHJlYW06IHN0cmVhbVxuICAgICAgfSk7XG4gICAgICBwZWVyLm9uKCdzaWduYWwnLCBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICBzb2NrZXQuZW1pdCgnc2lnOm9mZmVyJywgSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xuICAgICAgICBjb25zb2xlLmxvZygnc2VudCBvZmZlcicsIGRhdGEpOyAgICAgXG4gICAgICB9KVxuICAgIH0pO1xuXG5cbiAgICBzb2NrZXQub24oJ3NpZzphY2NlcHQnLCBmdW5jdGlvbihhY2NlcHQpe1xuICAgICAgYWNjZXB0ID0gSlNPTi5wYXJzZShhY2NlcHQpO1xuICAgICAgcGVlci5zaWduYWwoYWNjZXB0KTtcbiAgICAgIGNvbnNvbGUubG9nKCdnb3QgYWNjZXB0JyxhY2NlcHQpO1xuICAgICAgd2F0Y2hGb3JQZWVyKCk7XG4gICAgfSk7XG5cblxuICAgIHNvY2tldC5vbignc2lnOm9mZmVyJywgZnVuY3Rpb24ob2ZmZXIpe1xuICAgICAgb2ZmZXIgPSBKU09OLnBhcnNlKG9mZmVyKTtcbiAgICAgIGNvbnNvbGUubG9nKCdnb3Qgb2ZmZXInLG9mZmVyKTtcbiAgICAgIHBlZXIgPSBuZXcgUGVlcih7XG4gICAgICAgIGluaXRpYXRvcjogZmFsc2UsXG4gICAgICAgIHRyaWNrbGU6IGZhbHNlLFxuICAgICAgICBzdHJlYW06IHN0cmVhbVxuICAgICAgfSk7XG4gICAgICBwZWVyLm9uKCdzaWduYWwnLCBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICBzb2NrZXQuZW1pdCgnc2lnOmFjY2VwdCcsIEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcbiAgICAgICAgY29uc29sZS5sb2coJ3NlbnQgYWNjZXB0JywgZGF0YSk7ICAgICBcbiAgICAgIH0pXG4gICAgICBwZWVyLnNpZ25hbChvZmZlcik7XG4gICAgICB3YXRjaEZvclBlZXIoKTtcbiAgICB9KTtcblxuXG4gIH0pOyAvLyBlbmQgb2YgZ2V0VXNlck1lZGlhXG5cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvY2xpZW50L21haW4uanMiXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBRUEiLCJzb3VyY2VSb290IjoiIn0=");

/***/ })

},[19]);