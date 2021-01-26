const router = require('express').Router();
var { google } = require('googleapis');
var gmail = google.gmail('v1');
var OAuth2 = google.auth.OAuth2;
const auth = require('../routes/verifyToken');
const User = require('../models/User');

router.get('/compatible', auth, async (req, res) => {
  const user = await User.findOne({ _id: req.user._id });
  if (!user) return res.status(401).send('Invalid email !');

  if (user && user.googleToken != undefined)
    return res.status(200).send("Success")
  else
    return res.status(201).send('User is not connected with oAuth Google')
});

router.post('/sendEmail', auth, async (req, res) => {
  const user = await User.findOne({ _id: req.user._id });
  if (!user) return res.status(401).send('Invalid email !');

  const to = req.body.to
  const from = req.user.email
  const subject = req.body.subject
  const content = req.body.content

  if (user && user.googleToken) {
    function makeBody(to, from, subject, message) {
      var str = ["Content-Type: text/plain; charset=\"UTF-8\"\n",
        "MIME-Version: 1.0\n",
        "Content-Transfer-Encoding: 7bit\n",
        "to: ", to, "\n",
        "from: ", from, "\n",
        "subject: ", subject, "\n\n",
        message
      ].join('');

      var encodedMail = new Buffer(str).toString("base64").replace(/\+/g, '-').replace(/\//g, '_');
      return encodedMail;
    }
    var oauth2Client = new OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, "http://localhost:5000/oauth/Goauth2callback");
    oauth2Client.setCredentials({ access_token: user.googleToken });
    var raw = makeBody(to, from, subject, content);
    gmail.users.messages.send({
      auth: oauth2Client,
      userId: user.googleId,
      resource: {
        raw: raw
      }
    }, function (err, response) {
      return res.status(200).send("Success")
    });
  }
  else
    return res.status(400).send('User is not connected with oAuth Google')
});

router.post('/emailFROM', auth, async (req, res) => {
  const user = await User.findOne({ _id: req.user._id });
  if (!user) return res.status(401).send('Invalid email !');

  const from = req.body.from

  if (user && user.googleToken) {
    var oauth2Client = new OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, "http://localhost:5000/oauth/Goauth2callback");
    oauth2Client.setCredentials({ access_token: user.googleToken });
    var result = []
    gmail.users.messages.list({ userId: user.googleId, auth: oauth2Client },
      function (err, response) {
        for (let index = 0; index < 100; index++) {
          gmail.users.messages.get({ userId: user.googleId, id: response.data.messages[index].id, auth: oauth2Client },
            function (err, response) {
              var temp = ""
              for (let i = 0; i < response.data.payload.headers.length; i++) {
                temp = ""
                if (response.data.payload.headers[i].name == 'From') {
                  if (response.data.payload.headers[i].value.split("<").length < 2)
                    continue
                  temp = response.data.payload.headers[i].value.split("<")[1].slice(0, -1)
                }
                if (response.data.payload.headers[i].name == 'From' && temp === from) {
                  result.push(response.data.snippet)
                }
              }
              if ((index + 1) > 99) {
                return res.status(200).send({ message: result })
              }
            }
          );
        }
      }
    );
  }
  else
    return res.status(400).send('User is not connected with oAuth Google')
});

router.post('/emailCATEGORY', auth, async (req, res) => {
  const user = await User.findOne({ _id: req.user._id });
  if (!user) return res.status(401).send('Invalid email !');

  const category = req.body.from

  if (user && user.googleToken) {
    var oauth2Client = new OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, "http://localhost:5000/oauth/Goauth2callback");
    oauth2Client.setCredentials({ access_token: user.googleToken });
    var result = []
    var stop = false
    gmail.users.messages.list({ userId: user.googleId, auth: oauth2Client },
      function (err, response) {
        for (let index = 0; index < 100; index++) {
          gmail.users.messages.get({ userId: user.googleId, id: response.data.messages[index].id, auth: oauth2Client },
            function (err, response) {
              if (response.data.labelIds.indexOf(category) > -1) {
                result.push(response.data.snippet)
              }
              if (((index + 1) > 99 || result.length > 5) && stop == false) {
                stop = true
                return res.status(200).send({ message: result })
              }
            }
          );
        }
      }
    );
  }
  else
    return res.status(400).send('User is not connected with oAuth Google')
});

module.exports = router;