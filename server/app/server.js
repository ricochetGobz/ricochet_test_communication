/**
 * app/server.js
 *
 * Base on node.js server
 *
 */

import OFBridge from './core/OFBridge';
import WSServer from './core/WSServer';
import Cube from './components/Cube';


const cubes = {};
const bracelets = {};
const _OFBridge = new OFBridge();
const _WSServer = new WSServer(() => {
  _OFBridge.sendServerStatus(true);
});

let OFConnected = false;
let webRenderConnected = false;
let kinectConnected = false;

/**
 * #########################
 * INIT OPEN FRAMEWORK
 * #########################
 */

_OFBridge.onOFStatusChange((isConnected) => {
  if (isConnected) {
    OFConnected = true;
    _OFBridge.sendServerStatus(true);
    _OFBridge.sendWebRenderStatus(webRenderConnected);
  } else {
    OFConnected = false;
  }
  console.log(`OPEN FRAMEWORK : ${isConnected ? 'ON' : 'OFF'}`);
});

/**
 * #########################
 * RENDER WEB EVENTS
 * #########################
 */

_WSServer.onWebRenderStatusChange((isConnected) => {
  webRenderConnected = isConnected;
  console.log(`Web Render : ${isConnected ? 'ON' : 'OFF'}`);
  _OFBridge.sendWebRenderStatus(isConnected);
  if (isConnected) {
    _WSServer.sendToWebRender(`OPEN FRAMEWORK : ${OFConnected ? 'ON' : 'OFF'}`);
    // TODO check si le nombre de cube est > 0.
  }
});

/**
 * #########################
 * CUBE EVENTS
 * #########################
 */

_WSServer.onCubeConnected((idCube, idSound) => {
  cubes[idCube] = new Cube(idCube, idSound);
});

_WSServer.onCubeDisconnected((idCube) => {
  // TODO delete of other the cube
  delete cubes[idCube];
});

_WSServer.onCubeTouched((idCube) => {
  // TODO send to OF the cube of check if a new cube is see into OF.
});

_WSServer.onCubeDragged((idCube) => {
  // TODO send to OF the cube of check if a new cube is see into OF.
});

_WSServer.onCubeDragOut((idCube) => {
  // TODO
});

/**
 * #########################
 * ON EXIT
 * #########################
 * http://stackoverflow.com/questions/14031763/doing-a-cleanup-action-just-before-node-js-exits
 * http://stackoverflow.com/questions/21271227/can-node-js-detect-when-it-is-closed
 */
function exit(err) {
  _OFBridge.sendServerStatus(false);
  // WARN : SetTimeout for waiting the sender.
  setTimeout(() => {
    if (err) console.log(err.stack);
    process.exit();
  }, 200);
}
// so the program will not close instantly
process.stdin.resume();
// do something when app is closing
// process.on('exit', exit);
// catches ctrl+c event
process.on('SIGINT', exit);
// catches closed windows
process.on('SIGHUP', exit);
// catches uncaught exceptions
process.on('uncaughtException', exit);
