require('dotenv').config()
const express = require("express");
const app = express();
const router = express.Router();
const Datastore = require("nedb");
const db = new Datastore({ filename: "./database.db", autoload: true });
const Joi = require('joi');

const schema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net", "ro", "org", "io"] },
  })
});

app.use(express.static("../client"));
app.use(express.json());

console.log();

app.get("/", (req, res) => {
  // res.json('hello world!');
  res.end();
});

app.post("/login", (req, res) => {
  console.log("I got a request! Someone wants to login.");
  console.log(req.body);
  let { email, password } = req.body;
  // const {error, value} = schema.validate({email: req.body.email});

  // if(error) {
  //   res.status(200).json({message:error});
  //   return;
  // }

  if (
    db.find({ email: email, password: password }, (err, docs) => {
      if (err) {
        console.log(err);
      } else {
        if (docs.length > 0) {
          console.log("docs ", docs);
          let params = {};
          (params.status = "Success"),
            (params.message = "User found in database");
          params.id = docs[0]._id;
          console.log(params);
          res.status(200).json(params);
        } else {
          console.log("no results found in db");

          let insertObj = {};
          insertObj.message = 'Not Found';
          insertObj.status = 'Success';

          res.status(404).json(insertObj);
        }
      }
    })
  );
});

app.post("/register", (req, res) => {
  console.log("I got a request. Someone wants to create an account");
  let { username, password, email } = req.body;

  db.find({ email: email }, (err, docs) => {
    if (err) {
      return err;
    }
    console.log("docs email ", docs);
    if (docs.length > 0) {
      console.log("Email exists in DB");
      let paramsBack = {};
      paramsBack.status = "Email used";
      paramsBack.message = "This email is used";
      res.status(401).json(paramsBack);
    } else {
      db.find({ username: username }, (err, docs) => {
        if (err) {
          return err;
        }
        console.log("docs username", docs);
        if (docs.length > 0) {
          console.log("username is taken");
          let paramsBack = {};
          paramsBack.status = "Username taken";
          paramsBack.message = "This username is used";
          res.status(401).json(paramsBack);
        } else {
          db.insert({
            username: username,
            password: password,
            email: email,
            timestamp: new Date(),
          },(err,newDoc) => {
              if(err){
                  return err;
              }

              console.log('newDoc INSERT',newDoc);
              let paramsBack = {
                status: "Success",
                message: "User registered",
                id: docs._id,
              };
              res.status(200).json(paramsBack);
          });
        }
      });
    }
  });
});


app.post("/breed", (req,res) => {
    res.json('doggo doggo');
});


app.get("/breed/:id", (req,res) => {
  const requestParameters =  req.params;
  console.log(requestParameters);
  db.find({_id : requestParameters}, (err,docs) => {
    if(err) return err;

    if(docs.length > 0) {
      res.json(docs);
    } else {
      res.status(404).send('ID required is not on server');
    }
  });
});


app.listen(process.env.PORT, () => {
  console.log(`app is listening on port ${process.env.PORT}`);
});
