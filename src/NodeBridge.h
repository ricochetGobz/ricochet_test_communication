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
#define OF_CONNECTED "/OPConnected"
#define OF_DISCONNECTED "/OPDisconnected"
#define KINECT_CONNECTED "/KConnected"
#define KINECT_DISCONNECTED "/KDisconnected"
#define PLAY_CUBE "/playCube"

// RECEIVERS
#define SERVER_STARTED "/serverStarted"
#define SERVER_DOWN "/serverDown"
#define WEB_RENDER_CONNECTED "/WRConnected"
#define WEB_RENDER_DISCONNECTED "/WRDisconnected"
#define NEW_CUBE_CONNECTED "/newCubeConnected"

class NodeBridge {
    
public:
    // Constructor
    NodeBridge();
    
    void checkAddress(string address);
    void sendOPConnected();
    void sendOPDisconnected();
    void sendOFStatusChange(bool isConnected);
    void sendKinectStatusChange(bool isConnected);
    void sendPlayCube(int cubeId, int soundId, int x, int y);
    bool isStarted();
    bool webRenderIsConnected();
    bool kinectIsConnected();
    void setKinectStatus(bool status);
    
    
private:
    bool serverStarted = false;
    bool webRenderConnected = false;
    bool kinectConnected = false;

    //ofxOscReceiver receive; // DOESN T WORK HERE
    ofxOscSender sender;
    
    void send(string address, string arg);
};


#endif /* NodeBridge_h */
