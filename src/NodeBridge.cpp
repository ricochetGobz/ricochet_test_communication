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
    sendOPConnected();
}

void NodeBridge::checkAddress(string address) {
    
    if(address == SERVER_STARTED ) {
        cout << "Node server started" << endl;
        if(!serverStarted){
            cout << "Send" << endl;
            sendOPConnected();
            serverStarted = true;
        }
    } else if ( address == SERVER_DOWN ) {
        cout << "Node server down" << endl;
        serverStarted = false;
    }
}

void NodeBridge::sendOPConnected() {
    send(OP_CONNECTED, "");
}

void NodeBridge::sendOPDisconnected() {
    send(OP_DISCONNECTED, "");
}

void NodeBridge::sendActivateCube(string id) {
    send(ACTIVATE, id);
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
