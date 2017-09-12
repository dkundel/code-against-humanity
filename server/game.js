const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const twilio = require('twilio');

const NUM_OF_ROUNDS = 3;
const SNIPPET_PATH = path.join(__dirname, '..', 'snippets');

const client = twilio(
  process.env.TWILIO_API_KEY,
  process.env.TWILIO_API_SECRET,
  { accountSid: process.env.TWILIO_ACCOUNT_SID }
);

const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const syncClient = client.sync.services(process.env.TWILIO_SYNC_SERVICE);

async function create(req, res) {
  const { username } = req.body;
  const data = getInitialData(username);
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
  const { roomId, username } = req.body;
  const docInstance = syncClient.documents(`game:${roomId}`);
  try {
    const gameDoc = await docInstance.fetch();
    const data = gameDoc.data;
    if (data.standings.length >= 5) {
      res.status(400).send('The game is already full');
      return;
    }

    if (
      data.standings.find(player => player.username === username) !== undefined
    ) {
      res.status(400).send('Username already taken');
      return;
    }

    if (data.status !== 'open') {
      res.status(400).send('The game is already full');
      return;
    }

    data.standings.push({ username, score: 0 });
    if (data.standings.length === 5) {
      data.status = 'waitingToStart';
    }
    await docInstance.update({ data });
    res.send({ username, roomId });
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to join game');
  }
}

function finish(req, res) {}

async function judge(req, res) {
  const { roomId, username, winner } = req.body;
  const docInstance = syncClient.documents(`game:${roomId}`);
  try {
    const { data } = await docInstance.fetch();
    if (data.currentJudge !== username) {
      res.status(403).send('Invalid vote');
      return;
    }

    const idx = data.standings.findIndex(player => player.username === winner);
    if (idx === -1) {
      res.status(404).send('Invalid winner');
      return;
    }
    const winningPlayer = data.standings[idx];
    winningPlayer.score++;
    data.standings[idx] = winningPlayer;
    const { snippet, id, title, language } = await getCodeSnippet(
      data.pastSnippets
    );
    data.currentQuestion = { snippet, title, language };
    data.currentJudge = winner;
    data.status = 'showStandings';
    data.currentSubmissions = [];
    data.pastCodeSnippets.push(id);
    if (data.pastCodeSnippets.length > NUM_OF_ROUNDS) {
      data.status = 'gameover';
    }
    await docInstance.update({ data });
    res.send({});
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to judge');
  }
}

async function submit(req, res) {
  const { roomId, username, comment } = req.body;
  const docInstance = syncClient.documents(`game:${roomId}`);
  try {
    const { data } = await docInstance.fetch();
    const submission = { id: username, comment };
    if (
      username === data.currentJudge ||
      data.currentSubmissions.length === data.standings.length - 1
    ) {
      res.status(400).send('Invalid submission');
      return;
    }

    data.currentSubmissions.push(submission);
    if (data.currentSubmissions.length === data.standings.length - 1) {
      data.status = 'judging';
    }
    await docInstance.update({ data });
    res.send({});
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to submit');
  }
}

async function start(req, res) {
  const { roomId, username } = req.body;
  const docInstance = syncClient.documents(`game:${roomId}`);
  try {
    const { data } = await docInstance.fetch();
    if (data.creator !== username) {
      res.status(403).send('You are not the creator of the game');
      return;
    }
    const { username: currentJudge } = pickRandomMember(data.standings);
    const { snippet, id, title, language } = await getCodeSnippet(
      data.pastSnippets
    );
    const currentSubmissions = [];
    const pastCodeSnippets = [id];
    const status = 'submitting';
    const newData = {
      ...data,
      currentJudge,
      currentQuestion: { snippet, title, language },
      currentSubmissions,
      pastCodeSnippets,
      status
    };
    await docInstance.update({ data: newData });
    res.send({});
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to start game');
  }
}

function getInitialData(username) {
  const roomId = Math.random()
    .toString(36)
    .substr(2, 6);
  const standings = [{ username, score: 0 }];
  const currentJudge = undefined;
  const currentQuestion = undefined;
  const currentSubmissions = [];
  const pastSnippets = [];
  const status = 'open';

  return {
    creator: username,
    roomId,
    standings,
    currentJudge,
    currentQuestion,
    currentSubmissions,
    status
  };
}

async function getCodeSnippet(pastSnippets) {
  pastSnippets = pastSnippets || [];
  const filePaths = await readdir(SNIPPET_PATH);
  console.log(filePaths);
  const availableSnippets = filePaths
    .map(p => path.basename(p, '.snippet'))
    .map(id => parseInt(id))
    .filter(id => !isNaN(id))
    .filter(id => !pastSnippets.includes(id));

  const random = Math.floor(Math.random() * availableSnippets.length);
  const id = availableSnippets[random];
  const content = await readFile(
    path.join(SNIPPET_PATH, `${id}.snippet`),
    'utf8'
  );
  const { title, snippet, language } = parseSnippetFile(content);
  return {
    id,
    title,
    snippet,
    language
  };
}

function parseSnippetFile(c) {
  const indexOfLanguage = c.indexOf('LANGUAGE:');
  const indexOfCode = c.indexOf('CODE:');
  const title = c
    .substr(0, indexOfLanguage)
    .substr('TITLE:'.length)
    .trim();
  const language = c
    .substr(indexOfLanguage, c.indexOf('\n', indexOfLanguage) - indexOfLanguage)
    .substr('LANGUAGE:'.length)
    .trim();
  const snippet = c.substr(indexOfCode + 'CODE:'.length).trim();
  return { title, snippet, language };
}

function pickRandomMember(members) {
  const len = members.length;
  const random = Math.floor(Math.random() * len);
  return members[random];
}

module.exports = { create, join, finish, judge, submit, start };
