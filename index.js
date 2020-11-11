const express = require('express');
const path = require('path');

const BodyParser = require("body-parser")
const Config = require("getconfig");
const jwt = require("jsonwebtoken");

const app = express();
app.use(BodyParser.json());

app.get("/__healthcheck", async (_req, res) => {
  res.status(200).end();
});

app.get('/recording-complete', (req, res) => {
  console.log('Finished recording client');
  res.statusCode = 200;
  res.send('<html><body bgcolor=black></body></html>');
});

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'client/dist')));

const validateRecordingData = function (recordingToken, account_id) {

  let decoded;
  try {
    decoded = jwt.verify(recordingToken, secret);
    // Create user data for recording client
    const userDataToken = jwt.sign(
      {
        id: "recording-bot-client",
        isAHiddenBot: true
      }, Config.apiSecret
    );

    return {
      roomName: decoded.room,
      roomId: decoded.sub,
      userDataToken
    };
  }
  catch (err) {
    console.error(`Failed token validation ${err}`);
    return {
      error: err
    };
  }
}

app.post("/verify-recording", async (req, res) => {

  const recordingData = validateRecordingData(req.body.recording_token, req.body.org_key)
  console.log('RESPONSE:', recordingData);
  return res.send(recordingData);
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log('App is listening on port ' + port);