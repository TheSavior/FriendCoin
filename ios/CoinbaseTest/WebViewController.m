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


//- (NSString *)readContactList {
//    ABAddressBookRef addressBook = ABAddressBookCreateWithOptions(NULL, NULL);
//    CFArrayRef people = ABAddressBookCopyArrayOfAllPeople(addressBook);
//
//    CFIndex numberOfPeople = ABAddressBookGetPersonCount(addressBook);
//
//    NSMutableDictionary *myDictionary = [[NSMutableDictionary alloc] init];
//
//    for(int i = 0; i < numberOfPeople; i++) {
//
//        ABRecordRef person = CFArrayGetValueAtIndex( people, i );
//
//        NSString *firstName = (__bridge NSString *)(ABRecordCopyValue(person, kABPersonFirstNameProperty));
//        NSString *lastName = (__bridge NSString *)(ABRecordCopyValue(person, kABPersonLastNameProperty));
//        NSString *name = [NSString stringWithFormat:@"%@ %@", firstName, lastName];
//
////        kABPersonCompositeNameFormatFirstNameFirst
//
//        ABMultiValueRef phoneNumbers = ABRecordCopyValue(person, kABPersonPhoneProperty);
//
//        if(ABMultiValueGetCount(phoneNumbers) >= 1) {
//            NSString *phoneNumber = (__bridge_transfer NSString *) ABMultiValueCopyValueAtIndex(phoneNumbers, 0);
//            [myDictionary setObject:name  forKey:phoneNumber];
//        }
//
//        NSLog(@"=============================================");
//
//    }
//    NSError *error = nil;
//    NSData *json;
//
//    // Dictionary convertable to JSON ?
//    if ([NSJSONSerialization isValidJSONObject:myDictionary])
//    {
//        // Serialize the dictionary
//        json = [NSJSONSerialization dataWithJSONObject:myDictionary options:NSJSONWritingPrettyPrinted error:&error];
//
//        // If no errors, let's view the JSON
//        if (json != nil && error == nil)
//        {
//            NSString *jsonString = [[NSString alloc] initWithData:json encoding:NSUTF8StringEncoding];
//
//            NSLog(@"JSON: %@", jsonString);
//            return jsonString;
//        }
//    }
//
//    return NULL;
//}
//
//- (NSString *)getContactList {
//    CFErrorRef error = nil;
//    ABAddressBookRef addressBook = ABAddressBookCreateWithOptions(NULL, &error);
//    if (addressBook) {
//        ABAddressBookRequestAccessWithCompletion(addressBook, ^(bool granted, CFErrorRef error) {
//            if (granted) {
//
//                CFArrayRef people = ABAddressBookCopyArrayOfAllPeople(addressBook);
//                for (CFIndex idx = 0; idx < CFArrayGetCount(people); idx++) {
//                    ABRecordRef person = CFArrayGetValueAtIndex(people, idx);
//                    NSString *name = (__bridge NSString *)ABRecordCopyCompositeName(person);
//                    NSLog(@"SOMEONE NAMED %@", name);
//                }
//            } else {
//                // Send error
//            }
//        });
//    } else {
//        // Send error
//    }
//
//
//    if (ABAddressBookGetAuthorizationStatus() == kABAuthorizationStatusDenied ||
//        ABAddressBookGetAuthorizationStatus() == kABAuthorizationStatusRestricted){
//        //1
//        NSLog(@"Denied");
//        return NULL;
//    } else if (ABAddressBookGetAuthorizationStatus() == kABAuthorizationStatusAuthorized){
//        //2
//        NSLog(@"Authorized");
//
////        return [self readContactList];
//    } else{ //ABAddressBookGetAuthorizationStatus() == kABAuthorizationStatusNotDetermined
//        //3
//        NSLog(@"Not determined");
//
//        ABAddressBookRequestAccessWithCompletion(ABAddressBookCreateWithOptions(NULL, nil), ^(bool granted, CFErrorRef error){
//            if (!granted){
//                //4
//                NSLog(@"Just denied");
//                return NULL;
//            }
//            //5
//            NSLog(@"Just authorized");
//
////            return [self readContactList];
//        });
//    }
//
//    return NULL;
//}


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
            NSString *contacts = [contactListController GetContactList];
            
            NSString *javascript = [NSString stringWithFormat:@"contactResult('%@')", contacts];
            [self.webView stringByEvaluatingJavaScriptFromString:javascript];
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

@end
