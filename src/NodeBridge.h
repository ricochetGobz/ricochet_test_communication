//
//  NodeBridge.h
//  ricochet_test_communication
//
//  Created by Boulay Jérémie on 19/04/2016.
//
//

#ifndef NodeBridge_h
#define NodeBridge_h

#include "ofxOsc.h"

#define HOST "localhost"

#define SENDER_PORT 4444
#define RECEIVER_PORT 5555

// SENDERS
#define OP_CONNECTED "/OPConnected"
#define OP_DISCONNECTED "/OPDisconnected"
#define WEB_RENDER_CONNECTED "/WRConnected"
#define WEB_RENDER_DISCONNECTED "/WRDisconnected"
#define ACTIVATE "/activateCube"

// RECEIVERS
#define SERVER_STARTED "/serverStarted"
#define SERVER_DOWN "/serverDown"
#define NEW_CUBE_CONNECTED "/newCubeConnected"

class NodeBridge {
    
public:
    // Constructor
    NodeBridge();
    
    void checkAddress(string address);
    void sendOPConnected();
    void sendOPDisconnected();
    void sendActivateCube(string msg);
    bool isStarted();
    bool webRenderIsConnected();
    
    
private:
    bool serverStarted = false;
    bool webRenderConnected = false;
    ofxOscReceiver receive; // DOESN T WORK HERE
    ofxOscSender sender;
    
    void send(string address, string arg);
};


#endif /* NodeBridge_h */
