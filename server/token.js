const twilio = require('twilio');
const { AccessToken } = twilio.jwt;
const { SyncGrant } = AccessToken;

const {
  TWILIO_ACCOUNT_SID,
  TWILIO_API_KEY,
  TWILIO_API_SECRET,
  TWILIO_SYNC_SERVICE
} = process.env;

function createToken(identity) {
  const syncGrant = new SyncGrant({
    serviceSid: TWILIO_SYNC_SERVICE
  });

  const token = new AccessToken(
    TWILIO_ACCOUNT_SID,
    TWILIO_API_KEY,
    TWILIO_API_SECRET
  );
  token.addGrant(syncGrant);
  token.identity = identity;
  return token.toJwt();
}

function handleTokenRequest(req, res) {
  const { username, roomId } = req.query;
  if (!username || !roomId) {
    res.status(400).send('Missing parameters');
    return;
  }

  const identity = `${roomId}:${username}`;
  const token = createToken(identity);

  res.send({ token, identity, username, roomId });
}

module.exports = handleTokenRequest;
