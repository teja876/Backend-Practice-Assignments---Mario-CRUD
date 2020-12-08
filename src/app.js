const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const marioModel = require("./models/marioChar");

// Middlewares
app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// your code goes here

app.get("/mario", (req, res) => {
  marioModel.find().then((items) => res.send(items));
});

app.get("/mario/:id", (req, res) => {
  const id = req.params.id;
  marioModel
    .find({ _id: id })
    .then((items) => res.send(items))
    .error((err) => res.statusCode(400).send({ message: err.message }));
});

app.post("/mario", (req, res) => {
  if (!req.body.name || !req.body.weight)
    res.statusCode(400).send({ message: "either name or weight is missing" });
  else {
    const mario = new marioModel(req.body);
    mario.save().then((item) => res.statusCode(201).send(mario));
  }
});

app.patch("/mario/:id", (req, res) => {
  const id = req.params.id;
  marioModel.findById({ _id: id }, (err, mario) => {
    if (!mario) return res.statusCode(400).send({ message: err.message });
    for (let i in req.body) {
      mario[i] = req.body[i];
    }
    mario.save().then((item) => res.send(mario));
  });
  // if(!mario)  return res.statusCode(400).send({message: err.message});
  // for(let i in req.body){
  //   mario[i] = req.body[i];
  // }
  // mario.save().then(item => res.send(mario));
});

app.delete("/mario/:id", (req, res) => {
  const id = req.params.id;
  marioModel.findOneAndDelete({ _id: id }, (err, mario) => {
    if (!mario) return res.statusCode(400).send({ message: err.message });
    res.statusCode(200).send({ message: "character deleted" });
  });
});

module.exports = app;
