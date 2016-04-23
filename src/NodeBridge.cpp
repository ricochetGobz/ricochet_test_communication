//
//  NodeBridge.cpp
//  ricochet_test_communication
//
//  Created by Boulay Jérémie on 19/04/2016.
//
//

#include "NodeBridge.h"

//--------------------------------------------------------------
NodeBridge::NodeBridge(){
    //receive.setup(RECEIVER_PORT);
    sender.setup( HOST, SENDER_PORT );
    sendOFStatusChange(true);
    sendKinectStatusChange(kinectConnected);
}

void NodeBridge::checkAddress(string address) {
    
    if(address == SERVER_STARTED ) {
        cout << "Node server started" << endl;
        if(!serverStarted){
            serverStarted = true;
            sendOFStatusChange(true);
            sendKinectStatusChange(kinectConnected);
        }
    } else if ( address == SERVER_DOWN ) {
        cout << "Node server down" << endl;
        serverStarted = false;
        webRenderConnected = false;
    } else if( address == WEB_RENDER_CONNECTED ){
        cout << "web render connected" << endl;
        webRenderConnected = true;
    } else if ( address == WEB_RENDER_DISCONNECTED ){
        cout << "web render disconnected" << endl;
        webRenderConnected = false;

    }
}

void NodeBridge::sendOFStatusChange(bool isConnected) {
    if(isConnected){
        send(OF_CONNECTED, "");
    } else {
        send(OF_DISCONNECTED, "");
    }
}

void NodeBridge::sendKinectStatusChange(bool isConnected) {
    if(isConnected){
        send(KINECT_CONNECTED, "");
    } else {
        send(KINECT_DISCONNECTED, "");
    }
}

void NodeBridge::send(string address, string arg) {
    ofxOscMessage m;
    m.setAddress( address );
    if ( arg != "" ){
        m.addStringArg( arg );
    }
    sender.sendMessage( m );
}

bool NodeBridge::isStarted() {
    return serverStarted;
}

bool NodeBridge::webRenderIsConnected() {
    return webRenderConnected;
}

bool NodeBridge::kinectIsConnected() {
    return kinectConnected;
}

void NodeBridge::setKinectStatus(bool status){
    kinectConnected = status;
}
