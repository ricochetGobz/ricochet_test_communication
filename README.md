# Ricochet test communication

## Kinect / OpenFramework / Node.js / Web Renders

#### Procols used :

- Kinect to OpenFramework : USB Serial via ofKinect addon.
- OpenFramework to node.js : OSC communication.
- Node.js via WebRender : Websocket communication.

#### How to use

- Go to `server/render` and `npm install && npm build`.
- Go to `server/` and `npm install && npm start`.
- Plug the kinect.
- Start the OF project.

#### Util links

##### OSC :

- [node-osc](https://www.npmjs.com/package/node-osc)

- [ofxOsc input basics](https://www.youtube.com/watch?v=TczI-tSOIpY)
- [OP oscSenderExample](https://github.com/openframeworks/openFrameworks/blob/master/examples/ios/oscSenderExample/)

##### Kinect addons :

- [ofxKinect](https://github.com/ofTheo/ofxKinect)

##### Websocket :

- [websocket npm](https://www.npmjs.com/package/websocket)
