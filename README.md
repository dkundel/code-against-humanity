<p align="center">
  <img src="public/cah-logo.png" width="350">
</p>

# About

This is a game similar to Cards against Humanity or Quiplash. You'll be presented with a series of code snippets. One person is the judge in every round. Everyone else submits a *funny* suggestion that replaces the `???` placeholder in the respective snippet. Afterwards the judge will decide on what's funniest for them. The winner will be the judge in the next round. The game is powered by [Twilio Sync](https://www.twilio.com/sync)

May the funniest coder win!

# Setup

## 0. Requirements:
- Node.js and npm/yarn - [Download here](https://nodejs.org)
- Twilio Account - [Sign up here](https://www.twilio.com/try-twilio)

## 1. Clone code and install dependencies:

```bash
git clone https://github.com/dkundel/code-against-humanity.git
cd code-against-humanity
npm install
```

## 2. Create a Twilio Sync Service

Log into the [Twilio Console](https://www.twilio.com/console) and [create a Twilio Sync Service](https://www.twilio.com/console/sync/services). Store the Service SID for later.

## 3. Create an API Key/Secret

[Create a pair of API Key/Secret in the Twilio Console](https://www.twilio.com/console/runtime/api-keys) if you don't have one yet.

## 4. Set environment variables

Set the following environment variables. [If you don't know how, follow these instructions.](https://www.twilio.com/blog/2017/01/how-to-set-environment-variables.html)
- `TWILIO_ACCOUNT_SID`: [Get it in the Twilio Console](https://www.twilio.com/console)
- `TWILIO_API_KEY`: As created above
- `TWILIO_API_SECRET`: As created above
- `TWILIO_SYNC_SERVICE`: As created above

You can also configure the number of rounds (can't be more than files in the `snippets` folder) by setting `NUM_OF_ROUNDS`.

## 5. Start the server

```bash
NODE_ENV=production npm start
```

## 6. Open the page

Navigate to https://localhost:4000. You can also use a tool like [ngrok](https://ngrok.com) to tunnel your localhost to make it available to others.

## 7. Run in dev mode

If you want to run the code in dev mode run:

```bash
npm start
```

or 

```bash
npm start:dev
```

# License

MIT

# Contributors

- [Dominik Kundel](https://twitter.com/dkundel)
