/**
 * app/components/OFBridge.js
 *
 * Module to manage communication between
 * OpenFramework and Node.js
 *
 */

import osc from 'node-osc';
import utils from '../core/utils';

const SENDER_PORT = 5555;
const RECEIVER_PORT = 4444;
// RECEIVERS
const OPEN_FRAMEWORKS_CONNECTED = '/OPConnected';
const OPEN_FRAMEWORKS_DISCONNECTED = '/OPDisconnected';
const ACTIVATE_CUBE = '/activateCube';
// SENDERS
const SERVER_STARTED = '/serverStarted';
const SERVER_DOWN = '/serverDown';
const NEW_CUBE_CONNECTED = '/newCubeConnected';


export default class OFBridge {
  constructor() {
    // vars
    this.OPConnected = false;
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

  /**
   * #########################
   * SENDERS
   * #########################
   */
  _send(address, data) {
    const d = data || '';
    this._client.send(address, d);
  }

  sendNewCubeConnected(id) {
    if (typeof id === 'undefined') {
      utils.logError('OFBridge.sendNewCubeConnected() -- No id into argument');
      return;
    }
    this._send(NEW_CUBE_CONNECTED, id);
  }

  sendServerStarted() {
    this._send(SERVER_STARTED);
  }

  sendServerDown() {
    this._send(SERVER_DOWN);
  }

  /**
   * #########################
   * LISTENERS
   * #########################
   */
  _onMessageReceived(msg, rinfo) {
    const address = msg[0];
    const content = msg[1];

    console.log(`          Message receive to ${address}`);

    // LOCAL ACTIONS
    switch (address) {
      case OPEN_FRAMEWORKS_CONNECTED:
        this._OPConnected();
        break;
      case OPEN_FRAMEWORKS_DISCONNECTED:
        this._OPDisconnected();
        break;
      default:
        // LISTENERS BY DEFAULT
        if (!this._checkListeners(address, content)) {
          console.warn(`${address} address not used`);
          console.warn(rinfo);
        }
        break;
    }
  }

  _checkListeners(address, content) {
    if (typeof this._listeners[address] === 'function') {
      this._listeners[address](content);
      return true;
    }
    return false;
  }

  onOpenFrameworkConnected(callback) {
    this._listeners[OPEN_FRAMEWORKS_CONNECTED] = callback;
  }

  onOpenFrameworkDisconnected(callback) {
    this._listeners[OPEN_FRAMEWORKS_DISCONNECTED] = callback;
  }

  onActivateCube(callback) {
    this._listeners[ACTIVATE_CUBE] = (id) => {
      callback(id);
    };
  }


  _OPConnected() {
    if (!this.OPConnected) {
      this.OPConnected = true;
      this._send(SERVER_STARTED);
      // called only if OP not already connected
      this._checkListeners(OPEN_FRAMEWORKS_CONNECTED);
    }
  }

  _OPDisconnected() {
    this.OPConnected = false;
    this._checkListeners(OPEN_FRAMEWORKS_DISCONNECTED);
  }
}
