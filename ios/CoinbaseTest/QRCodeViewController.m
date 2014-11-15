//
//  QRCodeViewController.m
//  CoinbaseTest
//
//  Created by Conrad Kramer on 10/18/14.
//  Copyright (c) 2014 Conrad Kramer. All rights reserved.
//

#import <AVFoundation/AVFoundation.h>

#import "QRCodeViewController.h"

@interface QRCodeViewController () <AVCaptureMetadataOutputObjectsDelegate>

@property (nonatomic, strong) AVCaptureSession *session;
@property (nonatomic, weak) AVCaptureVideoPreviewLayer *previewLayer;

@end

@implementation QRCodeViewController

- (instancetype)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil {
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
        self.title = @"Scan QR Code";

        self.navigationItem.leftBarButtonItem = [[UIBarButtonItem alloc] initWithBarButtonSystemItem:UIBarButtonSystemItemCancel target:self action:@selector(cancel)];
        
        AVCaptureSession *session = [[AVCaptureSession alloc] init];
        [session beginConfiguration];
        
        AVCaptureDevice *device = [AVCaptureDevice defaultDeviceWithMediaType:AVMediaTypeVideo];
        if (device.lowLightBoostSupported && [device lockForConfiguration:nil]) {
            device.automaticallyEnablesLowLightBoostWhenAvailable = YES;
            [device unlockForConfiguration];
        }

        AVCaptureDeviceInput *input = [AVCaptureDeviceInput deviceInputWithDevice:device error:nil];
        if ([session canAddInput:input])
            [session addInput:input];

        AVCaptureMetadataOutput *output = [[AVCaptureMetadataOutput alloc] init];
        [output setMetadataObjectsDelegate:self queue:dispatch_get_main_queue()];
        if ([session canAddOutput:output])
            [session addOutput:output];

        output.metadataObjectTypes = @[AVMetadataObjectTypeQRCode];

        [session commitConfiguration];
        [session startRunning];
        self.session = session;
    }
    return self;
}

- (void)loadView {
    [super loadView];

    self.view.backgroundColor = [UIColor blackColor];

    AVCaptureVideoPreviewLayer *previewLayer = [AVCaptureVideoPreviewLayer layerWithSession:self.session];
    previewLayer.videoGravity = AVLayerVideoGravityResizeAspectFill;
    [self.view.layer addSublayer:previewLayer];
    self.previewLayer = previewLayer;
}

- (void)viewWillAppear:(BOOL)animated {
    [super viewWillAppear:animated];
    [self.session startRunning];
}

- (void)viewWillDisappear:(BOOL)animated {
    [super viewWillDisappear:animated];
    [self.session stopRunning];
}

- (void)viewDidLayoutSubviews {
    self.previewLayer.frame = self.view.layer.bounds;
}

- (void)cancel {
    if ([self.delegate respondsToSelector:@selector(codeViewControllerDidCancel:)])
        [self.delegate codeViewControllerDidCancel:self];
}

#pragma mark - AVCaptureMetadataOutputObjectsDelegate

- (void)captureOutput:(AVCaptureOutput *)captureOutput didOutputMetadataObjects:(NSArray *)metadataObjects fromConnection:(AVCaptureConnection *)connection {
    AVMetadataMachineReadableCodeObject *result = [metadataObjects firstObject];
    if ([self.delegate respondsToSelector:@selector(codeViewController:didScanString:)])
        [self.delegate codeViewController:self didScanString:result.stringValue];
}

@end
