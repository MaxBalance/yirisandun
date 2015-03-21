var exec = require('cordova/exec');

module.exports = {
    registerApp:function(){
        exec(function(){}, function(error){alert(error);}, "YFShare","registerApp", []);
    },
    auth:function(onSuccess, onError,args){
        exec(onSuccess, onError, "YFShare","auth", args);
    },
    logout:function(onSuccess,args){
        exec(onSuccess, function(){},"YFShare","logout", args);
    },
    share:function(onSuccess,onError,args){
        exec(onSuccess, onError, "YFShare","share", args);
    }

};
