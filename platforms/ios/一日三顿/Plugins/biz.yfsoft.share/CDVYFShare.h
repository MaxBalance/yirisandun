//
//  CDVYFShare
//
//
#import <Cordova/CDVPlugin.h>


@interface CDVYFShare : CDVPlugin

- (void)auth:(CDVInvokedUrlCommand*)command;
- (void)registerApp;
- (void)logout:(CDVInvokedUrlCommand*)command;
-(void)share:(CDVInvokedUrlCommand*)command;
@end
