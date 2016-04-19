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
#define ACTIVATE "/activate"

// RECEIVERS
#define SERVER_STARTED "/serverStarted"
#define SERVER_DOWN "/serverDown"

class NodeBridge {
    
public:
    // Constructor
    NodeBridge();
    
    ofxOscReceiver receive;
    ofxOscSender sender;
    
    void setup();
    void checkMessage();
    void sendOPConnected();
    void sendOPDisconnected();
    void sendActivateCube(string msg);
    
private:
    bool serverStarted = false;
    
    void send(string address, string arg);
};


#endif /* NodeBridge_h */
