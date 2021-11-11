const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const welcomeMessage = {
  id: 0,
  from: "Bart",
  text: "Welcome to CYF chat system!",
};

//This array is our "data store".
//We will start with one message in the array.
//Note: messages will be lost when Glitch restarts our server.
const messages = [welcomeMessage];

app.get("/", function (request, response) {
  response.sendFile(__dirname + "/index.html");
});
app.get("/messages", function(request, response){
  response.json(messages);
});

app.get("/messages/id/:id", function(request, response){
  const message = messages.find(m => m.id == request.params.id);
  response.json(message);
});

app.post("/messages", function(request, response){
  const from = request.body.from;
  const text = request.body.text;
  if(!from || !text){
    return response.status(400).json({error: "Message is missin some properties"})
  }

  const newMessage = {
    id: messages.length,
    from: from,
    text: text,
    timeSent: new Date()
  };
  messages.push(newMessage);
  response.json({success: true});
});

app.delete("/messages/id/:id", function(request, response){
  const index = messages.findIndex(m => m.id == request.params.id);
  messages.splice(index, 1);

  response.json({success: true});
});

app.get("/messages/search/:text",function(request, response){
  const searchText = request.params.text.toLowerCase();
  const searchString = messages.filter((msg)=>{
    const lowerCaseString= msg.text.toLowerCase();
    return lowerCaseString.includes(searchText);
  });
  if(searchString.length > 0){
    return response.send(searchString);
  } else{
    return response.status(400).send("Not results")
  }
});

app.get("/messages/latest", function(request, response){
  const recente10Messages= messages.slice(-10)
  response.json(recente10Messages);
});



app.listen(3000, () => {
   console.log("Listening on port 3000")
  });
