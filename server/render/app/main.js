/**
*
* app/main.js
* The entry point of your javascript application.
*
**/

import WSConnection from './core/WSConnection';

const _WSConnection = new WSConnection();
const DOMInstallStatus = document.getElementById('install-status');
const DOMDebug = document.getElementById('debug');

let OFConnected = false;
let kinectConnected = false;

function writeInDOM(status, info) {
  DOMInstallStatus.innerHTML = status;
  DOMDebug.innerHTML = info;
}
function start() {
  writeInDOM('ready', '');
}

function stop() {
  writeInDOM('not ready', `Open Framework : ${OFConnected ? 'ON' : 'OFF'},
   Kinect : ${kinectConnected ? 'ON' : 'OFF'}`);
}

function installIsReady() {
  return (OFConnected && kinectConnected);
}

function checkInstallStatus() {
  if (installIsReady()) {
    start();
  } else {
    stop();
  }
}

/**
 * #########################
 * CONNECION TO NODE.JS
 * #########################
 */
_WSConnection.onConnected(() => {
  console.log('WebSocket Client Connected');
});

_WSConnection.onError((err) => {
  writeInDOM('???', err);
});

_WSConnection.onDisconnected(() => {
  console.log('echo-protocol Client Closed');
  writeInDOM('???', 'Disconnected to the server');
});

_WSConnection.onOFStatusChange((isConnected) => {
  OFConnected = isConnected;
  checkInstallStatus();
});

_WSConnection.onKinectStatusChange((isConnected) => {
  kinectConnected = isConnected;
  checkInstallStatus();
});

_WSConnection.onPositionReceived((data) => {
  // TODO
  console.log(data);
});

/**
 * #########################
 * INIT
 * #########################
 */
_WSConnection.init();
checkInstallStatus();
