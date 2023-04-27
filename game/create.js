const socket = io(); // create new instance
join();
function join(){
  const room = String(Math.trunc(Math.random()*100000));
  const username = "Host " + room;
  socket.emit("joined", username, room);

  //document.getElementById("header").style.visibility = "visible";
  document.getElementById("header").innerHTML = "Room " + room;
  
}
function startGame(){
  //emit to start game to other stuff
  document.getElementById("gameScreen").hidden = false;
  const room = document.getElementById("header").innerHTML.substring(5);
  socket.emit("startGame", room);
}
function end(){
  const room = document.getElementById("header").innerHTML.substring(5);
  socket.emit("endGame", room);
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
  alert("reload recieved"); //checkpoint
  document.getElementById("people").innerHTML = "";
  Object.keys(users).forEach(function(key) {
    console.log(key, users[key]);
    if (users[key]["room"] == room){
      document.getElementById("people").innerHTML += "<li>" + users[key]["username"] + ": " + users[key]["score"] + "</li>";
    }
  });
});
socket.on("sendResponse", (choice, username) => {
  alert(choice + " " + username);
  const room = document.getElementById("header").innerHTML.substring(5);
  const score = Math.floor(document.getElementById("prog").value * 10);
  socket.emit("addToScore", username, room, score);
});




//Timer Stuff
var lastExecution = 0;
function start(timer){
  
  // Set the date we're counting down to
  var countDownDate = timer;
  var thisExe = new Date();
  lastExecution = thisExe;

  var x = setInterval(function() {
    if (thisExe == lastExecution){
      document.getElementById("timeDisplay").innerHTML = Math.floor(countDownDate * 100) / 100;
      countDownDate -= 0.01;
      document.getElementById("prog").value = countDownDate / timer * 100;
      if (countDownDate < 0){
        clearInterval(x);
      }
    }
    else{
      clearInterval(x);
    }

  }, 10);
}

function getScore(){
  document.getElementById("score").innerHTML = Math.floor(document.getElementById("prog").value * 10);
}
//End of Timer Stuff