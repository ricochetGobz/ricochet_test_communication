import osc from 'node-osc';

const SENDER_PORT = 5555;
const RECEIVER_PORT = 4444;

const OPEN_FRAMEWORKS_CONNECTED = '/OPConnected';
const PLAY = '/play';


// SEND MESSAGE
const client = new osc.Client('127.0.0.1', SENDER_PORT);
client.send('/newCubeConnected', 'c1', () => {
  client.kill();
});

// RECEIVE MESSAGE
const oscServer = new osc.Server(RECEIVER_PORT, '0.0.0.0');

oscServer.on('message', (message, rinfo) => {
  let msg = message;
  // CHECK THE DATA STRUCTURE OF OSC MESSAGE
  // Open Framework don't send the same array
  if (msg[0] === '#bundle') {
    msg = msg[2];
  }

  const url = msg[0];
  const content = msg[1];

  console.log('New Message to :', url);

  switch (url) {
    case OPEN_FRAMEWORKS_CONNECTED:
      console.log('OpenFrameworks is connected !');
      break;
    case PLAY:
      console.log(`OpenFramework wants to active the cube ${content}`);
      break;
    default:
      console.warn('##### WARN');
      console.warn(`The ${url} URL was not found :`);
      console.warn(msg, rinfo);
      console.warn('#####');
      break;
  }
});
