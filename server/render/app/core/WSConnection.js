/**
*
* core/WSConnection.js
* Connection on node.js server.
*
**/

import { w3cwebsocket as W3CWebSocket } from 'websocket';

const PORT = 3333

const SERVER_CONNECTED = 'serverconnected';
const SERVER_DISCONNECTED = 'serverdisconnected';
const SERVER_ERROR = 'servererror';
// RECEIVERS
const OPEN_FRAMEWORKS_STATUS_CHANGE = 'ofstatuschange';
const KINECT_STATUS_CHANGE = 'kinectstatuschange';

const POSITION_RECEIVED = 'positionreceived';


export default class WSConnection {
  constructor() {
    this._client = false;
    this._listeners = {};
  }

  init() {
    this._client = new W3CWebSocket(`ws://localhost:${PORT}/`, 'echo-protocol');

    this._client.onerror = (err) => {
      this._callListener(SERVER_ERROR, err);
    };

    this._client.onopen = () => {
      this._callListener(SERVER_CONNECTED);
    };

    this._client.onclose = () => {
      this._callListener(SERVER_DISCONNECTED);
    };

    this._client.onmessage = (e) => {
      if (typeof e.data === 'string') {
        const msg = JSON.parse(e.data);
        this._callListener(msg.address, msg.data);
      }
    };
  }

  _callListener(listener, data) {
    if (this._listeners[listener]) {
      this._listeners[listener](data);
    } else {
      console.log(`${listener} not listened`);
    }
  }

  _send(message) {
    if (typeof message !== 'string') {
      console.error('ERROR : Cannot send with message. It must be stringify');
      return;
    }
    if (this._client.readyState === this._client.OPEN) {
      this._client.send(message);
    } else {
      console.error('ERROR : server is lost');
    }
  }

  onConnected(callback) {
    this._listeners[SERVER_CONNECTED] = callback;
  }

  onDisconnected(callback) {
    this._listeners[SERVER_DISCONNECTED] = callback;
  }

  onError(callback) {
    this._listeners[SERVER_CONNECTED] = (err) => {
      callback(err);
    };
  }

  onOFStatusChange(callback) {
    this._listeners[OPEN_FRAMEWORKS_STATUS_CHANGE] = (isConnected) => {
      callback(isConnected);
    };
  }

  onKinectStatusChange(callback) {
    this._listeners[KINECT_STATUS_CHANGE] = (isConnected) => {
      callback(isConnected);
    };
  }

  onPositionReceived(callback) {
    this._listeners[POSITION_RECEIVED] = (data) => {
      console.log(data);
      // TODO
      callback(data);
    };
  }
}
