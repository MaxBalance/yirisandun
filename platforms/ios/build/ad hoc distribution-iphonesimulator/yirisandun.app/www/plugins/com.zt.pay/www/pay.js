cordova.define("com.zt.pay", function(require, exports, module) {
    var exec = require('cordova/exec');

    var Pay = function() {
    };

    Pay.alipay = function(order,callback){
        exec(null, null, "Pay", "alipay", order);
    };

    module.exports = Pay;

});
