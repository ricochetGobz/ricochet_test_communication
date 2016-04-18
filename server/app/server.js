var osc = require('node-osc');

let pokemon = "klk";

var SENDER_PORT = 5555;
var RECEIVER_PORT = 4444;

var OPEN_FRAMEWORKS_CONNECTED = "/OPConnected";
var PLAY = "/play";


// SEND MESSAGE
var client = new osc.Client('127.0.0.1', SENDER_PORT);
client.send('/newCubeConnected', "c1", function () {
  client.kill();
});


// RECEIVE MESSAGE
var oscServer = new osc.Server(RECEIVER_PORT, '0.0.0.0');

oscServer.on("message", function (msg, rinfo) {

  // CHECK THE DATA STRUCTURE OF OSC MESSAGE
  // Open Framework don't send the same array
  if(msg[0] === '#bundle') {
    msg = msg[2];
  }

  var url = msg[0];
  var message = msg[1];

  console.log("New Message to :", url);
  console.log("");

  switch (url) {
    case OPEN_FRAMEWORKS_CONNECTED:
      console.log("OpenFrameworks is connected !");
      break;
    case PLAY:
      console.log("OpenFramework wants to active the cube "+message);
      break;
    default:
      console.warn("##### WARN");
      console.warn("The "+url+" URL was not found :");
      console.warn(msg, rinfo);
      console.warn("#####")
      break;
  }
});
