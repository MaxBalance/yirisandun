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
static NSString *partner = @"2088111879618749";
static NSString *seller = @"aliridun@126.com";
static NSString *privateKey = @"MIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBAMNT7PfW1WnwaKDTLFfY1u4b7V1+CB2iKEYIE8p1K/u6oDRwUsJwNY09Gh9YmLJjKYhkOYqrDbZZB81c0PZwcN/nCbDJfX/XZaWPrEnMPSDgVbdd++XXOYXZAADRE/vpHAD9+0Q6QNXuEwh97iqba6NiNop4s8nvKH1rxMA+uhG3AgMBAAECgYBin0Nst7o1rT8GxNkE2eVbgBpPNE1guPlgsr9bX+H/TfGJyJTgu8suLwW7gf5HQ646wXAURd28jiNUW2Leq1Mxt++Cc+wY37kitlCcbKZBZyeG5OURt3YUXgevUyBytaDZp/YCIqn4xBgXe/vx9USBRjRLF+2nm5zqEsh6SMqTsQJBAOlQISxqsbEGhGTlLvcg6EBiAsUfZnBGe3rWNl8eB+IxTD7kFtsk4EHVHErO6ITFyFVJQoPa+vVZtzdrNH1BUVMCQQDWUjrHnqyy4aP6zSYmHxFb6QNlyQ8UcvzX90bPeyVK1L1vm8uP0TbYKbfenP3nvurrlgThJOCLFEf6ff3vsr2NAkEA10OCSAvtBKtBriGy0nq/Lt//NEcDaeXt+ej444u+tFjNw10JJYqBitwIrZD4AcDGVMIyJ5v8XjE3lV9JX6PLVwJAOlt3n+VH1wlzshXsPlMVUfZ3s1502beZu2CcimBYvjCBSIOegRGRonhxlY8f39tvciiOOZPmBFjIZJ+r5nm//QJAEhww3f+DXM6QR+A2vdUXNq4ESx7xWeik+yA5LMdWRzQTaLFCzD3SNp4eBwy3x63ke8skHnDvPiOQRpI0tG/A6Q==";
/*============================================================================*/
/*============================================================================*/
/*============================================================================*/

@interface CDVYFPay : CDVPlugin

//通过alipay去进行支付的操作


@property (nonatomic, strong) NSString *currentCallbackId;

- (void)alipay:(CDVInvokedUrlCommand*)command;

@end
