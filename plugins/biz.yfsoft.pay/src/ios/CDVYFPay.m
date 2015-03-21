//
//  YFPayPlug.m
//  ridunApp
//
//  Created by admin on 14-12-23.
//
//
#import "CDVYFPay.h"
#import "Order.h"
#import "DataSigner.h"
#import <Cordova/CDV.h>
#import <Cordova/CDVPlugin.h>
#import <AlipaySDK/AlipaySDK.h>
#import "AppDelegate.h"

@implementation CDVYFPay

//
//
- (void)alipay:(CDVInvokedUrlCommand*)command
{
    id generateTradeNO = [command.arguments objectAtIndex:0];
    
    NSString* subject = [command.arguments objectAtIndex:1];
    NSString* body = [command.arguments objectAtIndex:2];
    NSString* price = [command.arguments objectAtIndex:3];
    /*
     *点击获取prodcut实例并初始化订单信息
     */
    //Product *product = [self.productList objectAtIndex:indexPath.row];

    self.currentCallbackId = command.callbackId;
    /*
     *生成订单信息及签名
     */
    //将商品信息赋予AlixPayOrder的成员变量
    Order *order = [[Order alloc] init];
    order.partner = partner;
    order.seller = seller;
    order.tradeNO = generateTradeNO; //订单ID（由商家自行制定）
    order.productName = subject; //商品标题
    order.productDescription = body; //商品描述
    order.amount = price; //商品价格
    order.notifyURL =  @"http://58.220.249.174:8088/yirisandun/notify"; //回调URL
    
    order.service = @"mobile.securitypay.pay";
    order.paymentType = @"1";
    order.inputCharset = @"utf-8";
    order.itBPay = @"30m";
    order.showUrl = @"m.alipay.com";
    
    //应用注册scheme,在AlixPayDemo-Info.plist定义URL types
    NSString *appScheme = scheme;
    
    //将商品信息拼接成字符串
    NSString *orderSpec = [order description];
    
    //获取私钥并将商户信息签名,外部商户可以根据情况存放私钥和签名,只需要遵循RSA签名规范,并将签名字符串base64编码和UrlEncode
    id<DataSigner> signer = CreateRSADataSigner(privateKey);
    
    NSString *signedString = [signer signString:orderSpec];
    //将签名成功字符串格式化为订单字符串,请严格按照该格式
    NSString *orderString = nil;
    if (signedString != nil) {
        orderString = [NSString stringWithFormat:@"%@&sign=\"%@\"&sign_type=\"%@\"",
                       orderSpec, signedString, @"RSA"];
        
        
        [[AlipaySDK defaultService] payOrder:orderString fromScheme:appScheme callback:^(NSDictionary *resultDic) {
            NSLog(@"called payOrder from yfpayplugin");
        
        }];
//        NSString* resultStatus = [AppDelegate payResult];
//
//        if([@"6001" isEqualToString:resultStatus]){
//            //取消支付
//            NSLog(@"取消支付");
//
//        }else if([@"9000" isEqualToString:resultStatus]){
//            //支付成功
//            NSLog(@"成功支付");
//        }
//
//        NSDictionary *resultDic = @{@"result":resultStatus};
//
//        CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:resultDic];
//
//        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
//
        
    }

}


- (void)handleOpenURL:(NSNotification *)notification
{
    NSURL* url = [notification object];

    NSLog(@"====notification===%@",url);
    //跳转支付宝钱包进行支付，需要将支付宝钱包的支付结果回传给SDK
    if ([url.host isEqualToString:@"safepay"]) {
        [[AlipaySDK defaultService]
         processOrderWithPaymentResult:url
         standbyCallback:^(NSDictionary *resultDic) {
             NSString* resultStatus = [resultDic objectForKey:@"resultStatus"];
             NSLog(@"resultStatus = %@",resultStatus);
             if([@"6001" isEqualToString:resultStatus]){
                 //取消支付
                 NSLog(@"取消支付");

                 NSDictionary *resultDic = @{@"result":resultStatus};
                 CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:resultDic];
                 [self.commandDelegate sendPluginResult:result callbackId:self.currentCallbackId];

             }else if([@"9000" isEqualToString:resultStatus]){
                 //支付成功
                 NSLog(@"成功支付");
                 NSDictionary *resultDic = @{@"result":resultStatus};
                 CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:resultDic];
                 [self.commandDelegate sendPluginResult:result callbackId:self.currentCallbackId];
             }
        }];
    }

}


@end