cordova.define("biz.yfsoft.pay.YFPay", function(require, exports, module) { var exec = require('cordova/exec');

module.exports = {

    alipay:function(onSuccess, onError,args){
        exec(onSuccess, onError, "YFPay","alipay", args);
    }
};

});
