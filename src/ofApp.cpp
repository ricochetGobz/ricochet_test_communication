#include "ofApp.h"

//--------------------------------------------------------------
void ofApp::setup(){
    cout << "setup" << endl;

    ofSetFrameRate(60);
    ofSetLogLevel(OF_LOG_VERBOSE);
    ofSetCircleResolution(60);
    
    nodeBridge_receive.setup(RECEIVER_PORT);
    nodeBridge = *new NodeBridge();
    
    // Init the kinect after OSC servers
    kinectCapture.init();
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
    
    // Kinect update
    if(nodeBridge.kinectIsConnected() != kinectCapture.kinectIsConnected()){
        nodeBridge.setKinectStatus(kinectCapture.kinectIsConnected());
        nodeBridge.sendKinectStatusChange(nodeBridge.kinectIsConnected());
    }
    
    kinectCapture.update();
}

//--------------------------------------------------------------
void ofApp::draw(){
    ofBackground(100, 100, 100);
    ofSetColor(255, 255, 255);
    kinectCapture.draw();
    
    // COMMUNICATION INFORMATION
    stringstream reportStream;
    reportStream << "Node.js Server: " << ((nodeBridge.isStarted())?"ON":"OFF") << endl
    << "Web Render: " << ((nodeBridge.webRenderIsConnected())?"ON":"OFF") << endl
    << "Kinect: " << ((nodeBridge.kinectIsConnected())?"ON":"OFF - press (o) :: try to connect the kinect.") << endl;
    ofDrawBitmapString(reportStream.str(), 10, 20);
}

void ofApp::exit(){
    nodeBridge.sendOFStatusChange(false);
}

//--------------------------------------------------------------
void ofApp::keyPressed(int key){
    kinectCapture.onKeyPressed(key);
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
