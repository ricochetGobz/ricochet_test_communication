/**
 * app/components/OFBridge.js
 *
 * Module to manage communication between
 * OpenFramework and Node.js
 *
 */

import osc from 'node-osc';
import utils from './utils';

const SENDER_PORT = 5555;
const RECEIVER_PORT = 4444;
// RECEIVERS
const OPEN_FRAMEWORKS_CONNECTED = '/OPConnected';
const OPEN_FRAMEWORKS_DISCONNECTED = '/OPDisconnected';
// SENDERS
const WEB_RENDER_CONNECTED = '/WRConnected';
const WEB_RENDER_DISCONNECTED = '/WRDisconnected';
const SERVER_STARTED = '/serverStarted';
const SERVER_DOWN = '/serverDown';
const NEW_CUBE_CONNECTED = '/newCubeConnected';


export default class OFBridge {
  constructor() {
    // vars
    this._OFAlreadyConnected = false;
    this._listeners = {};

    // SEND MESSAGE
    this._client = new osc.Client('127.0.0.1', SENDER_PORT);

    // RECEIVE MESSAGE
    this._oscServer = new osc.Server(RECEIVER_PORT, '0.0.0.0');

    // LISTEN WHEN MESSAGE COMES
    this._oscServer.on('message', (message, rinfo) => {
      let msg = message;

      // CHECK THE DATA STRUCTURE OF OSC MESSAGE
      // Open Framework don't send the same array
      if (msg[0] === '#bundle') {
        msg = msg[2];
      }
      this._onMessageReceived(msg, rinfo);
    });
  }

  _onMessageReceived(msg, rinfo) {
    const address = msg[0];
    const content = msg[1];

    console.log(`          Message receive to ${address}`);

    // CALL LISTENER
    if (typeof this._listeners[address] === 'function') {
      this._listeners[address](content);
    } else {
      console.warn(`${address} address not used`);
      console.warn(rinfo);
    }
  }

  _send(address, data) {
    const d = data || '';
    this._client.send(address, d);
  }

  /**
   * #########################
   * SERVER EVENTS
   */
  // RECEIVERS
  // SENDERS
  sendServerStatus(isConnected) {
    if (isConnected) {
      this._send(SERVER_STARTED);
    } else {
      this._send(SERVER_DOWN);
    }
  }


  /**
   * #########################
   * OPEN FRAMEWORK EVENTS
   */
  // RECEIVERS
  onOFStatusChange(callback) {
    this._listeners[OPEN_FRAMEWORKS_CONNECTED] = () => {
      // called only if OP not already connected
      if (!this._OFAlreadyConnected) {
        this._OFAlreadyConnected = true;
        callback(true);
      }
    };

    this._listeners[OPEN_FRAMEWORKS_DISCONNECTED] = () => {
      this._OFAlreadyConnected = false;
      callback(false);
    };
  }
  // SENDERS


  /**
   * #########################
   * WEB RENDER EVENTS
   */
  // RECEIVERS
  // SENDERS
  sendWebRenderStatus(isConnected) {
    if (isConnected) {
      this._send(WEB_RENDER_CONNECTED);
    } else {
      this._send(WEB_RENDER_DISCONNECTED);
    }
  }


  /**
   * #########################
   * CUBE EVENT
   */
  // RECEIVERS
  // SENDERS
  sendNewCubeConnected(id) {
    if (typeof id === 'undefined') {
      utils.logError('OFBridge.sendNewCubeConnected() -- No id into argument');
      return;
    }
    this._send(NEW_CUBE_CONNECTED, id);
  }
}
