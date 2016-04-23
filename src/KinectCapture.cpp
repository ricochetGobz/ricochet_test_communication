//
//  KinectCapture.cpp
//  V 0.1
//  ricochet_test_kinect
//
//  Created by Boulay Jérémie on 15/04/2016.
//
//

#include "KinectCapture.h"

KinectCapture::KinectCapture() {
    
    // enable depth->video image calibration
    kinect.setRegistration(true);
    
    kinect.init();
    //kinect.init(true); // shows infrared instead of RGB video image
    //kinect.init(false, false); // disable video image (faster fps)
    
    kinect.open();		// opens first available kinect
    //kinect.open(1);	// open a kinect by id, starting with 0 (sorted by serial # lexicographically))
    //kinect.open("A00362A08602047A");	// open a kinect using it's unique serial #
    
    // print the intrinsic IR sensor values
    if(kinect.isConnected()) {
        ofLogNotice() << "sensor-emitter dist: " << kinect.getSensorEmitterDistance() << "cm";
        ofLogNotice() << "sensor-camera dist:  " << kinect.getSensorCameraDistance() << "cm";
        ofLogNotice() << "zero plane pixel size: " << kinect.getZeroPlanePixelSize() << "mm";
        ofLogNotice() << "zero plane dist: " << kinect.getZeroPlaneDistance() << "mm";
    }
    
    colorImg.allocate(kinect.width, kinect.height);
    grayImage.allocate(kinect.width, kinect.height);
    grayThreshNear.allocate(kinect.width, kinect.height);
    grayThreshFar.allocate(kinect.width, kinect.height);
    
    nearThreshold = 230;
    farThreshold = 70;
    bThreshWithOpenCV = true;
    
    ofSetFrameRate(60);
    
    // zero the tilt on startup
    angle = 0;
    kinect.setCameraTiltAngle(angle);
}

void KinectCapture::update() {
    kinect.update();
    
    // there is a new frame and we are connected
    if(kinect.isFrameNew()) {
        
        // load grayscale depth image from the kinect source
        grayImage.setFromPixels(kinect.getDepthPixels(), kinect.width, kinect.height);
        
        // we do two thresholds - one for the far plane and one for the near plane
        // we then do a cvAnd to get the pixels which are a union of the two thresholds
        if(bThreshWithOpenCV) {
            grayThreshNear = grayImage;
            grayThreshFar = grayImage;
            grayThreshNear.threshold(nearThreshold, true);
            grayThreshFar.threshold(farThreshold);
            cvAnd(grayThreshNear.getCvImage(), grayThreshFar.getCvImage(), grayImage.getCvImage(), NULL);
        } else {
            
            // or we do it ourselves - show people how they can work with the pixels
            unsigned char * pix = grayImage.getPixels();
            
            int numPixels = grayImage.getWidth() * grayImage.getHeight();
            for(int i = 0; i < numPixels; i++) {
                if(pix[i] < nearThreshold && pix[i] > farThreshold) {
                    pix[i] = 255;
                } else {
                    pix[i] = 0;
                }
            }
        }
        
        // update the cv images
        grayImage.flagImageChanged();
        
        // find contours which are between the size of 20 pixels and 1/3 the w*h pixels.
        // also, find holes is set to true so we will get interior contours as well....
        contourFinder.findContours(grayImage, 10, (kinect.width*kinect.height)/2, 20, false);
    }

}

void KinectCapture::draw() {
    
    // INSCTUCTION
    stringstream reportStream;
    
    if(mode == NORMAL_MODE) {
        
        // TODO respecter l'omotécie
        kinect.draw(2, 2, ofGetWidth() - 4, ofGetHeight() - 4);
        
        // TODO afficher les cubes capturés
        
        reportStream << "NORMAL MODE" << endl
        << "press (m) :: switch between modes" << endl << endl;
        
    } else if (mode == CALIBRATION_MODE){
        // draw from the live kinect
        kinect.drawDepth(10, 10, 400, 300);
        kinect.draw(420, 10, 400, 300);
        
        grayImage.draw(10, 320, 400, 300);
        contourFinder.draw(10, 320, 400, 300);
        
        reportStream << "CALIBRATION MODE" << endl
        << "press (m) :: switch between modes" << endl
        << "press (spacebar) :: using opencv threshold = " << bThreshWithOpenCV << endl
        << "press (w) :: toggle death near value = " << kinect.isDepthNearValueWhite() << endl
        << "press (+ -) :: set near threshold = " << nearThreshold << endl
        << "press (< >) :: set far threshold = " << farThreshold << endl;
        if(kinect.hasCamTiltControl()) {
            reportStream << "press (UP DOWN) :: change the tilt angle = " << angle << " degrees" << endl << endl;
        }
        
        reportStream << "num blobs found = " << contourFinder.nBlobs << ", fps = " << ofGetFrameRate() << endl;
        
        
    } else if (mode == CLOUD_MODE) {
        reportStream << "CLOUD MODE" << endl
        << "press (m) :: switch between modes" << endl << endl
        << "rotate the point cloud with the mouse" << endl;
        
        easyCam.begin();
        drawPointCloud();
        easyCam.end();
    }
    ofDrawBitmapString(reportStream.str(), 20, 652);
}


void KinectCapture::drawPointCloud() {
    int w = 640;
    int h = 480;
    ofMesh mesh;
    mesh.setMode(OF_PRIMITIVE_POINTS);
    int step = 2;
    for(int y = 0; y < h; y += step) {
        for(int x = 0; x < w; x += step) {
            if(kinect.getDistanceAt(x, y) > 0) {
                mesh.addColor(kinect.getColorAt(x,y));
                mesh.addVertex(kinect.getWorldCoordinateAt(x, y));
            }
        }
    }
    glPointSize(3);
    ofPushMatrix();
    // the projected points are 'upside down' and 'backwards'
    ofScale(1, -1, -1);
    ofTranslate(0, 0, -1000); // center the points a bit
    glEnable(GL_DEPTH_TEST);
    mesh.drawVertices();
    glDisable(GL_DEPTH_TEST);
    ofPopMatrix();
}

bool KinectCapture::kinectIsConnected(){
    return kinect.isConnected();
}


void KinectCapture::onKeyPressed(int key) {
    switch (key) {
        case'm':
            mode++;
            if(mode == 3){
                mode = 0;
            }
            break;
        case 'o':
            kinect.setCameraTiltAngle(angle); // go back to prev tilt
            kinect.open();
            break;
        default:
            if(mode == CALIBRATION_MODE){
                switch (key) {
                    case ' ':
                        bThreshWithOpenCV = !bThreshWithOpenCV;
                        break;
                    case '>':
                    case '.':
                        farThreshold ++;
                        if (farThreshold > 255) farThreshold = 255;
                        break;
                        
                    case '<':
                    case ',':
                        farThreshold --;
                        if (farThreshold < 0) farThreshold = 0;
                        break;
                        
                    case '+':
                    case '=':
                        nearThreshold ++;
                        if (nearThreshold > 255) nearThreshold = 255;
                        break;
                        
                    case '-':
                        nearThreshold --;
                        if (nearThreshold < 0) nearThreshold = 0;
                        break;
                        
                    case 'w':
                        kinect.enableDepthNearValueWhite(!kinect.isDepthNearValueWhite());
                        break;
                        
                    case OF_KEY_UP:
                        angle++;
                        if(angle>30) angle=30;
                        kinect.setCameraTiltAngle(angle);
                        break;
                        
                    case OF_KEY_DOWN:
                        angle--;
                        if(angle<-30) angle=-30;
                        kinect.setCameraTiltAngle(angle);
                        break;
                }
                
            }
            break;
    }
}
