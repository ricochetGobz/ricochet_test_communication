/**
*
* app/main.js
* The entry point of your javascript application.
*
**/
import { w3cwebsocket as W3CWebSocket } from 'websocket';

const PORT = 3333;
const client = new W3CWebSocket(`ws://localhost:${PORT}/`, 'echo-protocol');

function send(message) {
  if (typeof message !== 'string') {
    console.error('ERROR : Cannot send with message. It must be a string');
    return;
  }
  if (client.readyState === client.OPEN) {
    client.send(message);
  } else {
    console.error('ERROR : server is lost');
  }
}


client.onerror = () => {
  console.log('Connection Error');
};

client.onopen = () => {
  console.log('WebSocket Client Connected');
  send('web render connected');
};

client.onclose = () => {
  console.log('echo-protocol Client Closed');
};

client.onmessage = (e) => {
  if (typeof e.data === 'string') {
    console.log(`Received: ${e.data}`);
  }

  // TODO recevoir les coordonnées des points a jouer.
};
