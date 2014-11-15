//
//  QRCodeViewController.h
//  CoinbaseTest
//
//  Created by Conrad Kramer on 10/18/14.
//  Copyright (c) 2014 Conrad Kramer. All rights reserved.
//

#import <UIKit/UIKit.h>

@class QRCodeViewController;

@protocol QRCodeViewControllerDelegate <NSObject>
@optional
- (void)codeViewController:(QRCodeViewController *)codeViewController didScanString:(NSString *)string;
- (void)codeViewControllerDidCancel:(QRCodeViewController *)codeViewController;
@end

@interface QRCodeViewController : UIViewController

@property (nonatomic, weak) id<QRCodeViewControllerDelegate> delegate;

@end
