//
//  YFPayPlug.h
//  ridunApp
//
//  Created by admin on 14-12-23.
//
//
#import <Cordova/CDVPlugin.h>

/*
 *商户的唯一的parnter和seller。
 *签约后，支付宝会为每个商户分配一个唯一的 parnter 和 seller。
 */

/*============================================================================*/
/*=======================需要填写商户app申请的===================================*/
/*============================================================================*/
static NSString *scheme = @"yf.alipay";
static NSString *partner = @"2088611493753054";
static NSString *seller = @"572710486@qq.com";
static NSString *privateKey = @"MIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBALC/U9KGOjf4oJ4XnUU2HMu0WaFSZh7Htcp+2SEe+kQHBEu3eMUpjDhUjbsfYvaJ+c+oIF/TQpUpvg8xJehUWviV7He6IU71XofBg+5VdFI2WThKFlW6KQFoDW+cgRZLeNdtTUli0RxCW0J7Q4IBUwMk5AsZRl7vcgwbxz6JuaWlAgMBAAECgYEAgzfYNFDAwjMMk7I2aV7OLBGeBV2WQT3FYiugaa2E4aJP9yKkP8QjvOJRQt3/a8dttlQ8jMfcA7+0wbScTwrpaa1Ieu8LBxvPw/D+tzvWxxTz+YEwizEFyEgAplIsLVkOJtLMk3c2HBVIOCyo8VwpiJpQqQeizcEbF98+ELdrAiECQQDo4K5FUrhInnmD1XT4UcWwl29C7kHEJQJS4fZAc/VOB1z7B5DT4kRpd+GTFY/Ve63bOh8Dh0pWPLRHxTnp6/mJAkEAwkvrLLliP+0yFXLJOHDiEOHXZXbMjxmhWCTuqUL+ZOn74AlRLkk8Gozx5PrXMIZDwHkdSLSLeQpHDB9bSimwPQJADG7qfwMCmcX0QOilnRhokJwVMaKc2kcLj7dGuXw3bZoRCcoGnnlnI6Zl4b919XTr/FdnDn4rpt0I1wgdpnKV2QJAI/9IzPpzt4BMnSitGyXe3F3bOFMwRvrqp5gAF5/v3eZz4egYAElVN14RmujWYYkemFRYFpZMmNpMm3Rbx3u9yQJAPGNlnzWgZkqUIXhCmreWIx+iz0E2/i1lLEoa25U6N6J+AoetRlU+Mf1aTYa3Ci4PKek4b1LLnXAaHZTcShzkaA==";
/*============================================================================*/
/*============================================================================*/
/*============================================================================*/

@interface CDVYFPay : CDVPlugin

//通过alipay去进行支付的操作


@property (nonatomic, strong) NSString *currentCallbackId;

- (void)alipay:(CDVInvokedUrlCommand*)command;

@end
