let express = require('express'); // connect index.js with html
let app = express();
let bodyParser = require('body-parser'); // help index.js to read website input
let http = require('http').Server(app);
const { MongoClient, ServerApiVersion } = require('mongodb'); // mongodb database
const uri = "mongodb+srv://houjer23:boUt14cam.@cluster0.tu2u1e6.mongodb.net/?retryWrites=true&w=majority";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
const myDB = client.db("Fan5"); // connect to database named Fan5
// connect to sepecific collection
const User = myDB.collection("users");
const questions = myDB.collection("questions");

const jwt = require('jsonwebtoken');
const JWT_SECRET = "secret"

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));


//Set up the Express router
app.get('/', function (req, res) {
  res.sendFile('/index.html', {root:'.'});
});

app.get('/go_to_register', function (req, res) {
  res.sendFile('/register.html', {root:'.'});
});

app.get('/go_to_login', function (req, res) {
  res.sendFile('/login.html', {root:'.'});
});

app.get('/add_quiz', function (req, res) {
  res.sendFile('/inputQuiz.html', {root:'.'});
});

app.get('/paste_quiz', function (req, res) { //obtaining and sending 
  res.sendFile('pasteQuiz/paste_quiz.html', {root:'.'}); //going to this page
});


app.post('/paste_quiz', async function (req, res) {
  console.log(req.body.paste);//paste is your id //body of the webpg
  
  
});
//obtaining the data 
app.get('/create_game_room', function (req, res) {
  res.sendFile('/game/create.html', {root:'.'});
});

app.get('/join_game_room', function (req, res) {
  res.sendFile('/game/join.html', {root:'.'});
});

app.post('/quizType', function (req, res) {
  quiz = req.body.quiz1;
  if (quiz == "MCQ") {
    res.sendFile('/quizInput/mcq.html', {root:'.'});
  } else if (quiz == "T/F") {
    res.sendFile('/quizInput/true_false.html', {root:'.'});
  } else {
    res.sendFile('/quizInput/reorder.html', {root:'.'});
  }
})

app.post('/mcqInput', async function (req, res) { //async means the function will return a promise 
  console.log(req.body);
  let question = { type: "MCQ", question: req.body.ques, a: req.body.first, b: req.body.second, c: req.body.third, d: req.body.fourth, correct: req.body.correct };
  const result = await questions.insertOne(question);
console.log(
   `A document was inserted with the _id: ${result.insertedId}`,
);
})

app.post('/reorderInput', async function (req, res) {
  console.log(req.body);
  let question = { type: "reorder", question: req.body.ques2, a: req.body.first2, b: req.body.second2, c: req.body.third2, d: req.body.fourth2, correctt: req.body.correct2 };
  const result = await questions.insertOne(question);
console.log(
   `A document was inserted with the _id: ${result.insertedId}`,
);
})

app.post('/truefalseInput', async function (req, res) {
  console.log(req.body);
  let question = { type: "T/F", question: req.body.ques1, a: req.body.first1, b: req.body.second1, correct: req.body.correct1 };
  const result = await questions.insertOne(question);
console.log(
   `A document was inserted with the _id: ${result.insertedId}`,
);
})

app.post('/create', function (req, res) {
  console.log(req.body);
  let customer = { name: req.body.name, address: req.body.address, telephone: req.body.telephone, note: req.body.note };
  run2(customer).catch(console.dir);
})

app.post('/register', async function (req, res) {
  let user = { username: req.body.username, password: req.body.password };
  const result = await User.insertOne(user);
console.log(
   `A document was inserted with the _id: ${result.insertedId}`,
);
})


app.post('/login', async function (req, res) {
  const {username, password} = req.body;
console.log(username);
const user = await User.findOne({username});
if(await !user){
  return res.json({error:"User Does Not Exist"})
}
if(password === user.password){
  console.log(`${password} IS the same as ${user.password}`);
  console.log(`User ID: ${user._id}`)

  
  
  if(res.status(201)){
    console.log("no status error")
  }else{
    return res.json({error: "error"})
  }
}else{
  console.log(`${password} is not the same as ${user.password}`)
}
})
  app.get('/login', function (req, res) {
  res.sendFile('/index.html', {root:'.'});
});



// Socket
//purpose of v.4 is to create a start game

const io = require("socket.io")(http); // create instance of socketio
app.use(express.static("game")); // use "public" directory for static files
const users = {}; // create dictionary of users and their socket ids
io.on("connection", socket => {
  socket.on("joined", (username, room) => { // when server recieves the "joined" message
    socket.join(room); // join the room
    alert("sending joined"); //checkpoint
    io.to(room).emit("joined", username); // tell the clients in the room that someone has joined
    users[socket.id] = {username:username,room:room,score:0}; // add user to dictionary
    console.log(users);
    console.log("sending reload") //checkpoint

    console.log(myDB.questions.find())
    
    io.to(room).emit("reload", users, room);
  });
  socket.on("disconnect", () => { // when someone closes the tab
    let username = users[socket.id]["username"]; // get username of user
    let room = users[socket.id]["room"] // get room the user was in
    io.to(room).emit("leave", username); // tell the clients in the room that someone has left
    delete users[socket.id]; // remove user from dictionary
    console.log(users);
    io.to(room).emit("reload", users, room);
  });
  socket.on("startGame", (room) => {
    io.to(room).emit("startGame");
  });
  socket.on("sendAnswers", (choice, username, room) => {
    io.to(room).emit("sendResponse", choice, username);
  });
  socket.on("addToScore", (username, room, score) => {
    Object.keys(users).forEach(function(key) {
      console.log(key, users[key]);
      if (users[key]["room"] == room && users[key]["username"] == username){
        users[key]["score"] += score;     
      }
    });
    io.to(room).emit("sendScore", username, score);
    io.to(room).emit("reload", users, room);
  });
  socket.on("endGame", (room) => {
    var highest;
    Object.keys(users).forEach(function(key) {
      console.log(key, users[key]);
      if (users[key]["room"] == room){
        if (highest == null || users[key]["score"] > highest){
          highest = users[key]["score"];
        }
      }
    });
    io.to(room).emit("redirectPodium", highest);
  });
  /*
  socket.on("check room exists", room =>{
    const found = false;
    Object.keys(users).forEach(function(key) {
      console.log(key, users[key]);
      if (users[key]["username"] == "Host " + room){
        found = true;
      }
    });
    if (found == false){
      io.to(room).emit("notFound");
    }
  });
  */
});

http.listen(3000)
