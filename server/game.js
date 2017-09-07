const twilio = require('twilio');

const client = twilio(
  process.env.TWILIO_API_KEY,
  process.env.TWILIO_API_SECRET,
  { accountSid: process.env.TWILIO_ACCOUNT_SID }
);

const syncClient = client.sync.services(process.env.TWILIO_SYNC_SERVICE);

async function create(req, res) {
  const { username } = req.body;
  const data = getInitialData();
  const { roomId } = data;

  try {
    await syncClient.documents.create({
      uniqueName: `game:${roomId}`,
      data
    });
    res.send({ username, roomId });
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to create game');
  }
}

async function join(req, res) {
  const { roomId } = req.body;
  try {
    const gameDoc = await syncClient.documents(`game:${roomId}`).fetch();
    const data = gameDoc.data;
    if (data.standings.length >= 5) {
      res.status(400).send('The game is already full');
      return;
    }
    data.standings.push([{ username, score: 0 }]);
    res.send({ username, roomId });
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to join game');
  }
}

function finish(req, res) {}

function judge(req, res) {}

function start(req, res) {}

function getInitialData(username) {
  const roomId = Math.random()
    .toString(36)
    .substr(2, 6);
  const standings = [{ username, score: 0 }];
  const currentJudge = undefined;
  const currentQuestion = undefined;
  const currentSubmissions = [];
  const status = 'open';

  return {
    roomId,
    standings,
    currentJudge,
    currentQuestion,
    currentSubmissions,
    status
  };
}

module.exports = { create, join, finish, judge, start };
