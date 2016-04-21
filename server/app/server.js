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

/**
 * #########################
 * INIT OPEN FRAMEWORK
 * #########################
 */

_OFBridge.onOpenFrameworkConnected(() => {
  console.log('OPEN FRAMEWORK IS CONNECTED');
  _OFBridge.sendWebRenderStatus(_WSServer.webRenderConnected());
  // _OFBridge.sendNewCubeConnected('c1');
});

_OFBridge.onActivateCube((id) => {
  console.log(`OpenFramework wants to activate the cube ${id}`);
  // TODO send request to cube
  // TODO send animation to webview
  /*
   * idCube
   * idSound
   * pos.x, pos.y
   */
});

/**
 * #########################
 * RENDER WEB EVENTS
 * #########################
 */

_WSServer.onWebRenderStatusChange((status) => {
  console.log(`Web Render : ${status ? 'ON' : 'OFF'}`);
  _OFBridge.sendWebRenderStatus(status);
  if (status) {
    _WSServer.sendToWebRender('salut le web render !');
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
