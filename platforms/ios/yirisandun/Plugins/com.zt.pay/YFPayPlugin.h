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
static NSString *partner = @"2088611493753054";
static NSString *seller = @"572710486@qq.com";
static NSString *privateKey = @"MIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBAKBypWXnjgnwWTmM2zQufnbs1x4hQ4kPZwoVcMi+u2OVHG31i721aW12P3bRf0HxYef6aEIVeEZMi/jX+ECI88ufqYQGyh3GPXb+Gjh05TM+nQAuRM6OOpr2UqJd/7IGF8J6FPOLsh+kSbALCliGpCo/2nqfkZjjA2X6kqAyFJ9pAgMBAAECgYB/MaOxH1nYwzLYjrOPsHQM70Cx4Ajb9NvogIrCeYGwNhstiITZRaFoZ190YCwUKLlG35obGU4Z3MDx6rQg5PDu8C6qEmOoYFuY/IMVEYFaZ362xlPVnB2euwitBm6GN+0aBU0uO+M3+bFjv/LjhenzcBFGaGh0bqFfQ4/STmhqAQJBAM0ShaJwllf4NLSv/PSPv5CguMBKsQnCbhhaj4YXJPFn9w/Sx0Ua9VyduinAuvxNybR2Qn8Njcu4MFOeV5EwYckCQQDISx6r3iv8wJ2XdJJ/SX+Ug9TaCuN7fE9lM1SmFZq3vSh2ePzwAh7prdhyYLAxExdctJfeYCDGtiKtS6DJ/iChAkEAjrGOryMsWfXppri2iO3lXBuZsqPGYIYb2XJaX/GG0TuIXEhMRDen91QBD8B928W8zodjacjim5iEeAq739kMkQJALY1wH1R7GpPQA5cejlZv7p4A9coOLJJ8GB8RfGhjdLBPmIoxtIA2+ZxxIqo8yBx4brwf4hJowejAgDs4CViDoQJAYKJCNMrJDV4poLqtwloni3vA8G+x/YgGq8jts27EUEith4VBOwEe7q7KkW9nDqehyc91jQ2g9xMeSZhIHPqc0Q==";
/*============================================================================*/
/*============================================================================*/
/*============================================================================*/

@interface YFPayPlugin : CDVPlugin

//通过alipay去进行支付的操作

- (void)alipay:(CDVInvokedUrlCommand*)command;

@end
