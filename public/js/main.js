webpackJsonp([0],{21:function(e,n,t){t(8)({video:!1,audio:!0},function(e,n){if(e)return console.error(e);var o=t(9),d=new o({initiator:"#init"===location.hash,trickle:!1,stream:n});d.on("signal",function(e){document.getElementById("yourId").value=JSON.stringify(e)}),document.getElementById("connect").addEventListener("click",function(){var e=JSON.parse(document.getElementById("otherId").value);d.signal(e)}),document.getElementById("send").addEventListener("click",function(){var e=document.getElementById("yourMessage").value;d.send(e)}),d.on("data",function(e){document.getElementById("messages").textContent+=e+"\n"}),d.on("stream",function(e){var n=document.createElement("video");document.body.appendChild(n),n.src=window.URL.createObjectURL(e),n.play()})})}},[21]);
//# sourceMappingURL=main.map