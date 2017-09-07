const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');

const PORT = process.env.PORT || 4000;

const app = express();
const client = twilio(
  process.env.TWILIO_API_KEY,
  process.env.TWILIO_API_SECRET,
  { accountSid: process.env.TWILIO_AUTH_TOKEN }
);

app.get('/token', require('./token'));

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
