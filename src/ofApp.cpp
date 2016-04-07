#include "ofApp.h"

//--------------------------------------------------------------
void ofApp::setup(){
    /// Graphisme init  ///
    ofBackground(255, 255, 255);
    ofSetCircleResolution(60);

    receive.setup(RECEIVER_PORT);
    sender.setup( HOST, SENDER_PORT );


    cout << "setup" << endl;


    ofxOscMessage m;
    m.setAddress( "/OPConnected" );
    sender.sendMessage( m );

}

//--------------------------------------------------------------
void ofApp::update(){

    while(receive.hasWaitingMessages()){
        ofxOscMessage m;
        receive.getNextMessage(&m);

        cout << m.getAddress() << endl;
    }

}

//--------------------------------------------------------------
void ofApp::draw(){ }





//--------------------------------------------------------------
void ofApp::keyPressed(int key){
    if (key == OF_KEY_UP){
        ofxOscMessage m;
        m.setAddress( "/play" );
        m.addStringArg( "c2" );
        sender.sendMessage( m );
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
void ofApp::gotMessage(ofMessage msg){

}

//--------------------------------------------------------------
void ofApp::dragEvent(ofDragInfo dragInfo){

}
