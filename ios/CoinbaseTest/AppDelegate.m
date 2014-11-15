//
//  AppDelegate.m
//  CoinbaseTest
//
//  Created by Conrad Kramer on 10/18/14.
//  Copyright (c) 2014 Conrad Kramer. All rights reserved.
//

#import "AppDelegate.h"
#import "WebViewController.h"

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    self.window = [[UIWindow alloc] initWithFrame:[[UIScreen mainScreen] bounds]];
    self.window.rootViewController = [[WebViewController alloc] init];
    [self.window makeKeyAndVisible];

    return YES;
}

@end
