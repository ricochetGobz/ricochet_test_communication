#include "ofApp.h"

//--------------------------------------------------------------
void ofApp::setup(){
    /// Graphisme init  ///
    ofBackground(255, 255, 255);
    ofSetCircleResolution(60);

    cout << "setup" << endl;
    
    nodeBridge_receive.setup(RECEIVER_PORT);
    nodeBridge = *new NodeBridge();
}

//--------------------------------------------------------------
void ofApp::update(){
    
    //NODE BRIDGE CHECK MESSAGE RECEIVE
    while(nodeBridge_receive.hasWaitingMessages()){
        ofxOscMessage m;
        nodeBridge_receive.getNextMessage(&m);
        string address = m.getAddress();
        cout << address << endl;
        
        nodeBridge.checkAddress(address);
    }
}

//--------------------------------------------------------------
void ofApp::draw(){ }

void ofApp::exit(){
    nodeBridge.sendOPDisconnected();
}

//--------------------------------------------------------------
void ofApp::keyPressed(int key){
    if (key == OF_KEY_UP){
        nodeBridge.sendActivateCube("c1");
    }
}

//--------------------------------------------------------------
void ofApp::keyReleased(int key){

}

//--------------------------------------------------------------
void ofApp::mouseMoved(int x, int y ){

}

//--------------------------------------------------------------
void ofApp::mouseDragged(int x, int y, int button){

}

//--------------------------------------------------------------
void ofApp::mousePressed(int x, int y, int button){

}

//--------------------------------------------------------------
void ofApp::mouseReleased(int x, int y, int button){

}

//--------------------------------------------------------------
void ofApp::mouseEntered(int x, int y){

}

//--------------------------------------------------------------
void ofApp::mouseExited(int x, int y){

}

//--------------------------------------------------------------
void ofApp::windowResized(int w, int h){

}

//--------------------------------------------------------------
void ofApp::dragEvent(ofDragInfo dragInfo){

}
