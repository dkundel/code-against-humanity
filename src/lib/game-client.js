import * as EventEmitter from 'event-emitter';
import { stringify } from 'query-string';
import { AccessManager } from 'twilio-common';
import { SyncClient } from 'twilio-sync';

let instance;
class GameClient {
  static shared() {
    instance = instance || new GameClient();
    return instance;
  }

  constructor() {
    this.client = undefined;
    this.username = undefined;
    this.roomId = undefined;
    this.identity = undefined;
    this.game = undefined;
    this.gameDoc = undefined;
  }

  async init(username, roomId) {
    if (this.client) {
      return this.client;
    }

    this.username = username;
    this.roomId = roomId;

    const { token, identity } = await this.fetchToken();
    this.identity = identity;
    this.accessManager = this.createAccessManager(token);
    this.client = this.createClient(token);
    this.gameDoc = await this.client.document(`game:${roomId}`);
    this.game = this.gameDoc.value;
    this.addEventListeners();
    return this.game;
  }

  getGame() {
    return this.game;
  }

  get(key) {
    return this.game[key];
  }

  set(key, value) {
    if (!key) {
      return;
    }

    return this.gameDoc.update({
      [key]: value
    });
  }

  addEventListeners() {
    this.gameDoc.on('updated', data => {
      this.game = data;
      this.emit('updated', { game: data });
    });

    this.gameDoc.on('updatedRemotely', data => {
      this.game = data;
      this.emit('updated', { game: data });
    });
  }

  createAccessManager(token) {
    const accessManager = new AccessManager(token);
    accessManager.on('tokenExpired', async () => {
      const { token } = await this.fetchToken();
      accessManager.updateToken(token);
    });
    accessManager.on('tokenUpdated', () => {
      this.client.updateToken(this.accessManager.token);
    });
    return accessManager;
  }

  createClient(token) {
    const client = new SyncClient(token);
    client.on('connectionStateChanged', ({ connectionState }) => {
      if (
        connectionState === 'disconnected' ||
        connectionState === 'error' ||
        connectionState === 'denied'
      ) {
        this.emit('disconnected');
        this.client = undefined;
      }
    });
    return client;
  }

  async fetchToken() {
    const query = stringify({
      username: this.username,
      roomId: this.roomId
    });
    const url = `/api/token?${query}`;
    const resp = await fetch(url);

    if (!resp.ok) {
      throw new Error('Failed to request token');
    }

    return resp.json();
  }
}

EventEmitter(GameClient.prototype);

export default GameClient;
