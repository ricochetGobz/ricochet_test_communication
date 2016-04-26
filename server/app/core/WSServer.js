/**
 * app/components/WSServer.js
 * Module to manage the websocket server
 * for the cubes, the web render and the gallery
 *
 */

import { server as WebSocketServer } from 'websocket';
import http from 'http';
import fs from 'fs';
import utils from './utils';

// TODO utiliser express peut être a la place de http seulement.

const PORT = 3333;

const URL_RENDER_WEB = `http://localhost:${PORT}`;
const URL_RENDER_WEB_DEBUG = 'http://localhost:9966';
const URL_CUBE = 'TODO';
const URL_BRACELET = 'TODO';

// LISTENERS
const WEB_RENDER_STATUS_CHANGE = 'webrenderstatuschange';
// SENDERS
const OPEN_FRAMEWORKS_STATUS_CHANGE = 'ofstatuschange';
const KINECT_STATUS_CHANGE = 'kinectstatuschange';
const PLAY_CUBE = 'playcube';

export default class WSServer {
  constructor(callback) {
    this.listeners = {};

    this._webRenderConnection = false;

    this.server = http.createServer((request, response) => {
      let url = './render/public';
      utils.logDate(`Received request for  ${request.url}`);

      if (request.url === '/') {
        url = `${url}/index.html`;
      } else {
        url = `${url}${request.url}`;
      }

      fs.readFile(url, (err, data) => {
        if (err) {
          utils.logError(err);
          response.writeHead(404);
          response.end();
          return;
        }
        response.writeHead(200, { 'Content-Type': 'text/html', 'Content-Length': data.length });
        response.write(data);
        response.end();
      });
    });

    this.server.listen(PORT, () => {
      utils.logDate(`Server is listening on port ${PORT}`);
      callback();
    });

    this.wsServer = new WebSocketServer({
      httpServer: this.server,
      autoAcceptConnections: false,
    });

    this.wsServer.on('request', (request) => {
      this._checkOrigin(request);
    });
  }

  /**
   * #########################
   * CONNECTION MANAGER
   * #########################
   */
  _checkOrigin(request) {
    // CHECK IF THE CONNECTED ITEM IS AN CUBE, BRACELET OR WEBREDER
    switch (request.origin) {
      case URL_RENDER_WEB:
        this._createWebRenderConnection(request);
        break;
      case URL_RENDER_WEB_DEBUG:
        this._createWebRenderConnection(request);
        break;
      case URL_CUBE:
        this._createCubeConnection(request);
        break;
      case URL_BRACELET:
        this._createBraceletConnection(request);
        break;
      default:
        // Make sure we only accept requests from an allowed origin
        request.reject();
        utils.logDate(`Connection from origin ${request.origin} rejected.`);
    }
  }

  _createWebRenderConnection(request) {
    if (this._webRenderConnection) {
      utils.logError('web render connection already exist');
      return;
    }

    this._webRenderConnection = request.accept('echo-protocol', request.origin);

    // CONNECTED
    this._callListener(WEB_RENDER_STATUS_CHANGE, true);

    // ON WEB RENDER RECEIVE MESSAGE
    this._on(this._webRenderConnection, (message) => {
      const content = message.utf8Data;
      console.log(`Web Render send : ${content}`);
    }, () => {
      this._webRenderConnection = false;
      this._callListener(WEB_RENDER_STATUS_CHANGE, false);
    });
  }

  _createCubeConnection(request) {
    // const connection = request.accept('arduino', request.origin);
  }
  _createBraceletConnection(request) {
    // const connection = request.accept('arduino', request.origin);
  }

  _on(connection, callbackMessage, callbackClose) {
    connection.on('message', (message) => {
      callbackMessage(message);
    });
    connection.on('close', (reasonCode, description) => {
      utils.logDate(`Peer ${connection.remoteAddress} disconnected.`);
      utils.logDate(`ReasonCode : ${reasonCode}`);
      utils.logDate(`Description : ${description}`);
      callbackClose(reasonCode);
    });
  }

  /**
   * #########################
   * LISTENERS
   * #########################
   */
  _callListener(listener, data) {
    if (this.listeners[listener]) {
      this.listeners[listener](data);
    }
  }

  /**
   * #########################
   * WEB RENDER EVENTS
   */
  // RECEIVERS
  onWebRenderStatusChange(callback) {
    this.listeners[WEB_RENDER_STATUS_CHANGE] = (status) => {
      callback(status);
    };
  }
  // SENDERS
  sendOFStatusChange(isConnected) {
    this._sendToWebRender(OPEN_FRAMEWORKS_STATUS_CHANGE, isConnected);
  }
  sendKinectStatusChange(isConnected) {
    this._sendToWebRender(KINECT_STATUS_CHANGE, isConnected);
  }

  _sendToWebRender(address, data) {
    if (this._webRenderConnection) {
      this._webRenderConnection.sendUTF(JSON.stringify({ address, data }));
    } else {
      utils.logError('You cannot send message, web render is disconnected');
    }
  }
  // STATUS
  webRenderConnected() {
    if (this._webRenderConnection) {
      return true;
    }
    return false;
  }

  /**
  * #########################
  * BRACELET EVENTS
  */
  onBraceletConnected(callback) {
    // TODO save callback(idCube, idSound);
  }

  // TODO send to bracelet

  /**
   * #########################
   * CUBE EVENTS
   */
   // RECEIVERS
  onCubeConnected(callback) {
    // TODO save callback(idCube, idSound);
  }

  onCubeDisconnected(callback) {
    // TODO save callback(idCube, idSound);
  }

  onCubeTouched(callback) {
    // TODO save callback(idCube);
  }

  onCubeDragged(callback) {
    // TODO save callback(idCube);
  }

  onCubeDragOut(callback) {
    // TODO save callback(idCube);
  }
  // SENDERS
  sendPlayCube(data){
    this._sendToWebRender(PLAY_CUBE, data);
  }
}
