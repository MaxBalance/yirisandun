ridunApp.filter('imgFilter',function(){
    return function(items){
        if(items.length==0){
            return items;
        }
        if(!items.length){
            if(!items.pic.indexOf('http://')==0){
                items.pic = 'http://www.yirisandun.com'+items.pic;
            }
        }else{
            //console.log(items);
            for(var i = 0;i<items.length;i++){
                var item = items[i];
                if(!item.pic.indexOf('http://')==0){
                    item.pic = 'http://www.yirisandun.com'+item.pic;
                }
                //TODO...如下是测试代码
                //item.pic = '';
                items[i] = item;
            }
        }
        return items;
    }
});

ridunApp.filter('errorHttp',function($ionicPopup,$timeout){
    return function(data){
        console.log(data);
        var alertPopup = $ionicPopup.alert({
            title:'数据连接异常!',
            okType:'button-balanced',okText:'确定'
        });
        $timeout(function() {
            alertPopup.close(); //close the popup after 1 seconds for some reason
        }, 1000);
        return false;
    }
});


ridunApp.filter('indexFilter',function(){
    var urlConvert = function(src){
        if(src == undefined){
            return src;
        }
        if(src.constructor == Array){
            for(var i = 0 ; i<src.length;i++){
                src[i] = urlConvert(src[i]);
            }
            return src;
        }
        if(src.fileurl){
            if(src.fileurl.indexOf('http://')<0){
                src.fileurl = 'http://www.yirisandun.com' + src.fileurl;
            }
        }else if(src.pic){
            if(src.pic.indexOf('http://')<0){
                src.pic = 'http://www.yirisandun.com' + src.pic;
            }
        }
        return src;
    };

    return function(data){
        var slider = data[0];
        slider = urlConvert(slider);
        data.limit = urlConvert(data[1]);

        data.star = urlConvert(data[2]);

        data.line3 = urlConvert(data[3]);
        data.line4 = urlConvert(data[4]);

        data.slider = slider;
        return data;
    }
});

//接口处理异常的过滤代码
//出现异常则返回 true  ， 处理正常返回 false
ridunApp.filter('errorHandler',function(){
    return function(data){
        if(data.code == 0){
            return false;
        }
        console.log(data);
        alert(data.msg||'应用数据处理错误!');
        return true;
    }
});

//格式化html页面上数字
ridunApp.filter('formatNumber', function () {
    return function (number,form) {
        var forms = form.split('.'), number = '' + number, numbers = number.split('.')
            , leftnumber = numbers[0].split('')
            , exec = function (lastMatch) {
                if (lastMatch == '0' || lastMatch == '#') {
                    if (leftnumber.length) {
                        return leftnumber.pop();
                    } else if (lastMatch == '0') {
                        return lastMatch;
                    } else {
                        return '';
                    }
                } else {
                    return lastMatch;
                }
            }, string;

        string = forms[0].split('').reverse().join('').replace(/./g, exec).split('').reverse().join('');
        string = leftnumber.join('') + string;

        if (forms[1] && forms[1].length) {
            leftnumber = (numbers[1] && numbers[1].length) ? numbers[1].split('').reverse() : [];
            string += '.' + forms[1].replace(/./g, exec);
        }
        return string.replace(/.$/, '');
    };;
});

//decodeURI
ridunApp.filter('decodeText', function () {
    return function (data) {
        return decodeURI(data);
    }
});