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
    receive.setup(RECEIVER_PORT);
    sender.setup( HOST, SENDER_PORT );

}

void NodeBridge::checkMessage() {

    while(receive.hasWaitingMessages()){
        cout << "received" << endl;
        ofxOscMessage m;
        receive.getNextMessage(&m);
        
        string address = m.getAddress();
        cout << address << endl;
        
        if(address == SERVER_STARTED ) {
            if(!serverStarted){
                sendOPConnected();
                serverStarted = true;
            }
        } else if ( address == SERVER_DOWN ) {
            serverStarted = false;
        }
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
