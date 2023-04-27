const socket = io(); // create new instance
var username;
var room;
var score = 0;

function join(){
  username = document.getElementById("name").value;
  room = document.getElementById("room").value;
  document.getElementById("addToRoom").hidden = true;
  socket.emit("joined", username, room);
  //socket.emit("check room exists", room);
  //document.getElementById("header").style.visibility = "visible";
  document.getElementById("header").innerHTML = "Room " + room;
}

function answer(choice){
  socket.emit("sendAnswers", choice, username, room);
}



//const username = prompt("enter name:"); // ask for the user's name
//const room = prompt("enter the room:"); // ask for what room the user wants to go
//socket.emit("joined", username, room);
socket.on("joined", username => { // when server tells client that someone has joined
  alert(username + " joined");
});
socket.on("leave", user => { // when server tells client that someone has left
  alert(user + " left");
});
socket.on("reload", (users, room) =>{
  document.getElementById("people").innerHTML = "";
  Object.keys(users).forEach(function(key) {
    console.log(key, users[key]);
    if (users[key]["room"] == room){
      document.getElementById("people").innerHTML += "<li>" + users[key]["username"] + "</li>";
    }
  });
});
socket.on("startGame", () => {
  alert("game has started");
  document.getElementById("gameScreen").hidden = false;
  document.getElementById("people").hidden = true;
});
socket.on("sendScore", (username, score) => {
  if (this.username == username){
    this.score = score;
  }
});
socket.on("redirectPodium", (highest) => {
  alert("recieved: highest = " + highest);
  if (score == highest){
    location.href = 'podium.html';
  }
  else{
    location.href = 'shame.html';
  }
});
/*
socket.on("notFound", () => {
  location.reload();
});
*/