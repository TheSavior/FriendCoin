//
//  WebViewController.m
//  CoinbaseTest
//
//  Created by Conrad Kramer on 10/18/14.
//  Copyright (c) 2014 Conrad Kramer. All rights reserved.
//

#import "WebViewController.h"
#import "QRCodeViewController.h"
#import "ContactListController.h"

@interface WebViewController () <UIWebViewDelegate, QRCodeViewControllerDelegate>

@property (nonatomic, weak) UIWebView *webView;

@end

static NSString * const CoinbaseBaseURLString = @"http://drawer.ngrok.com/";

@implementation WebViewController

- (void)loadView {
    [super loadView];

    self.view.backgroundColor = [UIColor colorWithWhite:0.133 alpha:1.000];

    UIWebView *webView = [[UIWebView alloc] init];
    webView.translatesAutoresizingMaskIntoConstraints = NO;
    webView.scrollView.bounces = NO;
    webView.delegate = self;
    [self.view addSubview:webView];
    self.webView = webView;

    id topLayoutGuide = self.topLayoutGuide;
    id bottomLayoutGuide = self.bottomLayoutGuide;
    NSDictionary *views = NSDictionaryOfVariableBindings(webView, topLayoutGuide, bottomLayoutGuide);
    [self.view addConstraints:[NSLayoutConstraint constraintsWithVisualFormat:@"H:|[webView]|" options:0 metrics:nil views:views]];
    [self.view addConstraints:[NSLayoutConstraint constraintsWithVisualFormat:@"V:[topLayoutGuide][webView][bottomLayoutGuide]" options:0 metrics:nil views:views]];
}

- (void)viewDidLoad {
    [super viewDidLoad];

    NSURLRequest *request = [NSURLRequest requestWithURL:[NSURL URLWithString:CoinbaseBaseURLString]];
    [self.webView loadRequest:request];
}

- (UIStatusBarStyle)preferredStatusBarStyle {
    return UIStatusBarStyleLightContent;
}


#pragma mark - UIWebViewDelegate

- (BOOL)webView:(UIWebView *)webView shouldStartLoadWithRequest:(NSURLRequest *)request navigationType:(UIWebViewNavigationType)navigationType {
    NSURLComponents *components = [NSURLComponents componentsWithURL:request.URL resolvingAgainstBaseURL:NO];
    if ([components.scheme isEqual:@"coinbase"]) {
        if ([components.host isEqualToString:@"readQRCode"]) {
            QRCodeViewController *codeViewController = [[QRCodeViewController alloc] init];
            codeViewController.delegate = self;
            UINavigationController *navigationController = [[UINavigationController alloc] initWithRootViewController:codeViewController];
            [self presentViewController:navigationController animated:YES completion:nil];
        }
        else if ([components.host isEqualToString:@"getContacts"]) {
            ContactListController *contactListController = [[ContactListController alloc] init];
            contactListController.delegate = self;
            [contactListController GetContactList];
        }
    }
    
    return YES;
}

#pragma mark - QRCodeViewControllerDelegate

- (void)codeViewController:(QRCodeViewController *)codeViewController didScanString:(NSString *)string {
    [codeViewController dismissViewControllerAnimated:YES completion:^{
        NSString *javascript = [NSString stringWithFormat:@"qrCodeResult('%@')", string];
        [self.webView stringByEvaluatingJavaScriptFromString:javascript];
    }];
}

- (void)codeViewControllerDidCancel:(QRCodeViewController *)codeViewController {
    [codeViewController dismissViewControllerAnimated:YES completion:^{
        NSString *javascript = @"qrCodeResult(undefined)";
        [self.webView stringByEvaluatingJavaScriptFromString:javascript];
    }];
}

#pragma mark - ContactListControllerDelegate

- (void)contactListController:(ContactListController *)contactListController didGetContacts:(NSString *)string {
        NSString *javascript = [NSString stringWithFormat:@"contactResult(%@)", string];
        [self.webView stringByEvaluatingJavaScriptFromString:javascript];
}
@end
