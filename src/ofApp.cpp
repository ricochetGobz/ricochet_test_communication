#include "ofApp.h"

//--------------------------------------------------------------
void ofApp::setup(){
    /// Graphisme init  ///
    ofBackground(255, 255, 255);
    ofSetCircleResolution(60);
    
    //setup the server to listen on 11999
    TCP.setup(11999);
}

//--------------------------------------------------------------
void ofApp::update(){
    
    //for each client lets send them a message letting them know what port they are connected on
//    for(int i = 0; i < TCP.getNumClients(); i++){
//        TCP.send(i, "hello client - you are connected on port - "+ofToString(TCP.getClientPort(i)) );
//    }
    
    //for each connected client lets get the data being sent and lets print it to the screen
    for(int i = 0; i < TCP.getNumClients(); i++){
        
        //get the ip and port of the client
        string port = ofToString( TCP.getClientPort(i) );
        string ip   = TCP.getClientIP(i);
        string info = "client "+ofToString(i)+" -connected from "+ip+" on port: "+port;
        cout << info << endl;
        
        //we only want to update the text we have recieved there is data
        string str = TCP.receive(i);
        cout << str << endl;
        
    }

}

//--------------------------------------------------------------
void ofApp::draw(){
    
    //for each connected client lets get the data being sent and lets print it to the screen
//    for(int i = 0; i < TCP.getNumClients(); i++){
//        
//        //get the ip and port of the client
//        string port = ofToString( TCP.getClientPort(i) );
//        string ip   = TCP.getClientIP(i);
//        string info = "client "+ofToString(i)+" -connected from "+ip+" on port: "+port;
//        cout << info << endl;
//        
//        //we only want to update the text we have recieved there is data
//        string str = TCP.receive(i);
//        cout << str << endl;
//        
//    }
}





//--------------------------------------------------------------
void ofApp::keyPressed(int key){

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
