const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const game = require('./game');

const PORT = process.env.PORT || 4000;

const app = express();

app.use(bodyParser.json());
app.get('/api/token', require('./token'));
app.post('/api/game/create', game.create);
app.post('/api/game/join', game.join);
app.post('/api/game/finish', game.finish);
app.post('/api/game/judge', game.judge);
app.post('/api/game/submit', game.submit);
app.post('/api/game/start', game.start);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'build')));
  app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
