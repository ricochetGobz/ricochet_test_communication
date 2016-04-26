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
const KINECT_CONNECTED = '/KConnected';
const KINECT_DISCONNECTED = '/KDisconnected';
const PLAY_CUBE = '/playCube';
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
    this._KinectAlreadyConnected = false;
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

    if (!this._callListener(address, content)) {
      console.warn(`${address} address not used`);
      console.warn(rinfo);
    }
  }

  _callListener(address, content) {
    if (typeof this._listeners[address] === 'function') {
      this._listeners[address](content);
    } else {
      return false;
    }
    return true;
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
      if (this._OFAlreadyConnected) {
        this._OFAlreadyConnected = false;
        this._callListener(KINECT_DISCONNECTED);
        callback(false);
      }
    };
  }

  onKinectStatusChange(callback) {
    this._listeners[KINECT_CONNECTED] = () => {
      if (!this._KinectAlreadyConnected) {
        this._KinectAlreadyConnected = true;
        callback(true);
      }
    };

    this._listeners[KINECT_DISCONNECTED] = () => {
      if (this._KinectAlreadyConnected) {
        this._KinectAlreadyConnected = false;
        callback(false);
      }
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
  onPlayCube(callback) {
    this._listeners[PLAY_CUBE] = (data) => {
      callback(data);
    };
  }

  // SENDERS
  sendNewCubeConnected(id) {
    if (typeof id === 'undefined') {
      utils.logError('OFBridge.sendNewCubeConnected() -- No id into argument');
      return;
    }
    this._send(NEW_CUBE_CONNECTED, id);
  }
}
