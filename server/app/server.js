/**
 * app/server.js
 *
 * Base on node.js server
 *
 */

import OFBridge from './components/OFBridge';


/**
 * #########################
 * OPEN FRAMEWORK COMMUNICATION
 * #########################
 */
const _OFBridge = new OFBridge();

_OFBridge.onOpenFrameworkConnected(() => {
  console.log('OPEN FRAMEWORK IS CONNECTED');

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

_OFBridge.sendServerStarted();

/**
 * #########################
 * ON EXIT
 * #########################
 * http://stackoverflow.com/questions/14031763/doing-a-cleanup-action-just-before-node-js-exits
 * http://stackoverflow.com/questions/21271227/can-node-js-detect-when-it-is-closed
 */
function exit(options, err) {
  _OFBridge.sendServerDown();
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
