'use strict';

let express = require('express');
let app = express();
let MongoClient = require('mongodb').MongoClient;
let bodyParser = require('body-parser');
let sendgrid = require('sendgrid')(process.env.SENDGRID_APIKEY);

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/main.html');
});

app.post('/rsvp', (req, res) => {
  let invitationStatus = parseInt(req.body.invitationStatus || "");
  let guestNameInput = (req.body.guestNameInput || "").trim();
  let weddingCheckbox = (req.body.weddingCheckbox || "").trim();
  let rehearsalCheckbox = (req.body.rehearsalCheckbox || "").trim();
  let email = (req.body.email || "").trim();
  let response = { messages: [], attending: invitationStatus > 0 };

  if (guestNameInput === "") {
    response.messages.unshift("Please tell us your name.");
  }

  if (isNaN(invitationStatus)) {
    response.messages.unshift("Please decline or accept the invitation.");
  }

  let checked = /on/i;
  if (invitationStatus > 0 &&
    !checked.test(weddingCheckbox) &&
    !checked.test(rehearsalCheckbox)) {
    response.messages.unshift("Which events are you attending?");
  }

  if (invitationStatus > 0 && !email) {
    response.messages.unshift("Please provide us with your e-mail address.");
  }

  console.log(response.messages);
  if (response.messages.length == 0) {
    try {
      save(req.body);
    }
    catch(ex) {
      response.messages.unshift("I wasn't able to save your RSVP.  Try submitting again, but if this keeps happening e-mail us at: styaners@staynerslegowan.com.")
      console.error(ex.message);
    }
  }
  res.json(response);
});

function save(rsvp) {
  let uri = process.env.MONGODB_URI;
  MongoClient.connect(uri, (err, db) => {
    if (err) {
      console.log(err);
      return;
    }
    let collection = rsvp.invitationStatus > 0 ?
      db.collection('accepted') :
      db.collection('declined');

    collection.insert(rsvp, (err, result) => {
      if (err) {
        console.error(err);
      }
      else {
        console.log(result);
      }
      db.close();
    });
  });
}

app.post('/email', (req, res) => {
  console.log(req);
})

app.listen(process.env.PORT);
