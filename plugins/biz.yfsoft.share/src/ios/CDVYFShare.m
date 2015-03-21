#import "CDVYFShare.h"
#import <Cordova/CDV.h>
#import <ShareSDK/ShareSDK.h>
#import <TencentOpenAPI/QQApiInterface.h>
#import <TencentOpenAPI/TencentOAuth.h>
#import "WXApi.h"

@implementation CDVYFShare

- (void)auth:(CDVInvokedUrlCommand*)command
{
    id type = [command argumentAtIndex:0];
    ShareType shareType;
    if([@"qq" isEqual:type]){
        shareType = ShareTypeQQSpace;
    }else{
        shareType = ShareTypeWeixiSession;
    }
    [ShareSDK getUserInfoWithType:shareType
        authOptions:nil
             result:^(BOOL result, id<ISSPlatformUser> userInfo, id<ICMErrorInfo> error) {
                 CDVPluginResult* pluginResult;
                  if (result)
                  {
                    NSDictionary* resultDic = @{@"uid":[userInfo uid],@"name":[userInfo nickname],@"icon":[userInfo profileImage]};
                      pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:resultDic];

                    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
                  }else{
                    pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"ERROR"];
                  }

              }];

}

- (void)registerApp
{
    [ShareSDK registerApp:@"5e79b74cce38"];
    //添加QQ空间应用
    [ShareSDK connectQZoneWithAppKey:@"222222"
                           appSecret:@"123456"
                   qqApiInterfaceCls:[QQApiInterface class]
                     tencentOAuthCls:[TencentOAuth class]];

    [ShareSDK connectWeChatWithAppId:@"wx1609b2bc9e2420d6"
                           appSecret:@"af167cbe79183c3954ee251a0a90b88c"
                           wechatCls:[WXApi class]];
}

- (void)logout:(CDVInvokedUrlCommand*)command{
    id type = [command argumentAtIndex:0];
    ShareType shareType;
    if([@"qq" isEqual:type]){
        shareType = ShareTypeQQSpace;
    }else{
        shareType = ShareTypeWeixiSession;
    }
    [ShareSDK cancelAuthWithType:shareType];
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"登出成功"];

    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}


-(void)share:(CDVInvokedUrlCommand*)command
{
    id title = [command argumentAtIndex:0];
    id content = [command argumentAtIndex:1];
    id url = [command argumentAtIndex:2];
    id desc = [command argumentAtIndex:3];
    //1、构造分享内容
    id<ISSContent> publishContent = [ShareSDK content:content
                                       defaultContent:@"默认内容"
                                                image:nil
                                                title:title
                                                  url:url
                                          description:desc
                                            mediaType:SSPublishContentMediaTypeNews];
    id<ISSContainer> container = [ShareSDK container];
    //[container setIPadContainerWithView:sender arrowDirect:UIPopoverArrowDirectionUp];
    //2、弹出分享菜单
    [ShareSDK showShareActionSheet:container
                         shareList:nil
                           content:publishContent
                     statusBarTips:YES
                       authOptions:nil
                      shareOptions:nil
                            result:^(ShareType type, SSResponseState state, id<ISSPlatformShareInfo> statusInfo, id<ICMErrorInfo> error, BOOL end) {

                                //可以根据回调提示用户。
                                if (state == SSResponseStateSuccess)
                                {
                                    UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"分享成功"
                                                                                    message:nil
                                                                                   delegate:self
                                                                          cancelButtonTitle:@"OK"
                                                                          otherButtonTitles:nil, nil];
                                    [alert show];
                                }
                                else if (state == SSResponseStateFail)
                                {
                                    UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"分享失败"
                                                                                    message:[NSString stringWithFormat:@"失败描述：%@",[error errorDescription]]
                                                                                   delegate:self
                                                                          cancelButtonTitle:@"OK"
                                                                          otherButtonTitles:nil, nil];
                                    [alert show];
                                }
                            }];
}



- (void)handleOpenURL:(NSNotification *)notification
{
    NSURL* url = [notification object];

    [ShareSDK handleOpenURL: url
          sourceApplication:nil
                 annotation: nil
                 wxDelegate: self];

}

@end