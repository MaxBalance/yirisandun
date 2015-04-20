services.service( 'Login', [ '$rootScope', '$http','Ds','$ionicPopup','$timeout',function( $rootScope,$http,Ds,$ionicPopup,$timeout ) {
    var service = {
        state:{},
        login:function(username,password){
            $http.get(API2.url('login?username='+username+'&password='+password))
                .success(function(data) {
                    if(data.code == 0){
                        Ds.set("user",data);
                        service.state = 1;
                        $rootScope.$broadcast( 'person.login.success' );
                    }else{
                        service.state = -1;
                        $rootScope.$broadcast( 'person.login.fail' );
                    }

                });
        },

        query:function(userid){
            $http.get(API.url('getUser?userid='+userid))
                .success(function(data) {
                    if(data.code == 0){
                        Ds.set("user",data);
                        service.state = 1;
                    }
                    $rootScope.$broadcast( 'person.query.success' );
                });
        },

        qqLogin: function (openid) {
            $http.get(API.url('unitelogin?openid='+openid))
                .success(function(data) {
                    if(data.code == 0){
                        Ds.set("user",data);
                        service.state = 1;
                    }
                    $rootScope.$broadcast( 'person.login.success' );
                });
        },

        getCart: function (userid) {
            $http.get(API2.url('badge?user_id='+userid))
                .success(function(data) {
                    if(data.code == 0){
                        Ds.set("user",data);
                    }
                    $rootScope.$broadcast( 'person.cart.success' );
                });
        },

        checkins: function (userid) {
            $http.get(API2.url('AddSign?userid='+userid))
                .success(function (data) {
                    if(data.code == 0){
                        $rootScope.$broadcast('checkins.success')
                    }else{
                        $rootScope.$broadcast('checkins.fail')
                    }
                })
        }

    }
    return service;
}]);

services.service( 'Register', [ '$rootScope', '$http','Ds','$ionicPopup',function( $rootScope,$http,Ds,$ionicPopup) {
    var service = {
        state:{},
        _register:function(person_r){
            $http.get(API2.url('register?username='+person_r.username+'&password='+person_r.password_one+'&mobile='+person_r.phone))
                .success(function(data) {
                    if(data.code == 0){
                        Ds.set("user",data);
                        service.state = 1;
                        $rootScope.$broadcast( 'person.register.success' );
                    }else{
                        service.state = -1;
                        $rootScope.$broadcast( 'person.register.fail' );
                    }

                });
        },
        getCode: function (person_r) {
            $http.get(API2.url('random?mobile='+person_r.phone))
                .success(function (data) {
                    if(data.code == 0){
                        Ds.set('LoginCode',data.random)
                        $rootScope.$broadcast('getCode.success');
                    }else{
                        $rootScope.$broadcast('getCode.fail');
                    }
                })
        }

    }
    return service;
}]);

services.service( 'Password', [ '$rootScope', '$http','Ds','$ionicPopup','$timeout',function( $rootScope,$http,Ds,$ionicPopup,$timeout ) {
    var service = {
        state:{},
        _password:function(person_w){
            service.userid = Ds.get("user").userid;
            var reg = /^[_0-9a-zA-Z]{0,20}$/;
            if (!reg.test(person_w.password_one) || person_w.password_one.length < 6 || person_w.password_one =='')
            {
                var alertPopup1 = $ionicPopup.alert({
                    title:'密码是由0-9\Aa-Zz\_组成的6位及以上组合!',
                    okType:'button-balanced',okText:'确定'
                });
                return false;
            }
            if(person_w.password_one != person_w.password_two){
                //alert("两次输入密码不一致");
                var alertPopup2 = $ionicPopup.alert({
                    title:'两次输入密码不一致!',
                    okType:'button-balanced',okText:'确定'
                });
                $timeout(function() {
                    alertPopup.close(); //close the popup after 1 seconds for some reason
                }, 1500);
                return service;
            }
            $http.get(API.url(
                'changePWD?userid='+service.userid+'&pwd_old='+person_w.password_origin+'&pwd_new='+person_w.password_one))
                .success(function(data) {
                    if(data.code == 0){
                        service.state = 1;
                        var alertPopup3 = $ionicPopup.alert({
                            title:'修改成功!',
                            okType:'button-balanced',okText:'确定'
                        });
                        $timeout(function() {
                            alertPopup.close(); //close the popup after 1 seconds for some reason
                        }, 1000);
                    }else{
                        var alertPopup4 = $ionicPopup.alert({
                            title:'修改失败，原密码错误!',
                            okType:'button-balanced',okText:'确定'
                        });
                        $timeout(function() {
                            alertPopup.close(); //close the popup after 1 seconds for some reason
                        }, 1500);
                        service.state = -1;
                    }
                    $rootScope.$broadcast( 'person.password' );
                });
        }
    }
    return service;
}]);

services.service( 'ProductDetail', [ '$rootScope', '$http','$ionicPopup',function( $rootScope,$http,$ionicPopup) {
    var service = {
        state:{},
        content:{},
        productDetail:function(productId){
            $http.get(API.url(
                'products/product?pro_id='+productId))
                .success(function(data) {
                    if(data.code == 0){
                        service.state = 1;
                        service.content = data.content[0];
                    }else{
                        var alertPopup = $ionicPopup.alert({
                            title:'接口异常!',
                            okType:'button-balanced',okText:'确定'
                        });
                        service.state = -1;
                    }
                    $rootScope.$broadcast( 'productDetail.init' );
                });
        }
    }
    return service;
}]);

services.service( 'PicDetail', [ '$rootScope', '$http','$ionicPopup',function( $rootScope,$http,$ionicPopup ) {
    var service = {
        state:{},
        content:{},
        picDetail:function(picId){
            $http.get(API.url(
                'products/product?pro_id='+picId))
                .success(function(data) {
                    if(data.code == 0){
                        service.state = 1;
                        service.content = data.content[0];
                        var hcontent = data.content[0].content;
                        if(hcontent.indexOf('http://')<0){
                            var reg = new RegExp("/upfile","g");
                            hcontent = hcontent.replace(reg,"http://www.yirisandun.com/upfile");
                            data.content[0].content = hcontent;
                        }
                    }else{
                        var alertPopup = $ionicPopup.alert({
                            title:'接口异常!',
                            okType:'button-balanced',okText:'确定'
                        });
                        service.state = -1;
                    }
                    $rootScope.$broadcast( 'picDetail.init' );
                });
        }
    }
    return service;
}]);

services.service( 'SameClass', [ '$rootScope', '$http','$filter','$ionicPopup','$timeout',function( $rootScope,$http ,$filter,$ionicPopup,$timeout) {
    var service = {
        productList : [],
        sameclass:function(classId){
            $http.get(API.url('products/class?class_id='+classId))
                .success(function(data) {
                    if(data.content != null){
                        service.productList = data.content;
                        $filter('imgFilter')(service.productList);
                    }
                    $rootScope.$broadcast( 'sameclass.init' );
                });
        }
    }
    return service;
}]);

services.service( 'Comment', [ '$rootScope', '$http','$ionicPopup','$timeout',function( $rootScope,$http,$ionicPopup,$timeout) {
    var service = {
        commentList : [],
        state : {},
        comment:function(pro_id){
            $http.get(API.url('comment/myCom?pro_id='+pro_id))
                .success(function(data) {
                    if(data.code == 0){
                        service.state = 1;
                        service.commentList = data.content;
                    }else{
                        //alert("接口异常!");
                        var alertPopup = $ionicPopup.alert({
                            title:'接口异常!',
                            okType:'button-balanced',okText:'确定'
                        });
                        service.state = -1;
                    }
                    $rootScope.$broadcast( 'comment.init' );
                });
        }
    }
    return service;
}]);

services.service( 'Message', [ '$rootScope', '$http','$ionicPopup','$timeout',function( $rootScope,$http,$ionicPopup,$timeout) {
    var service = {
        messageList : [],
        state : {},
        message:function(userId){
            $http.get(API.url('myMessGroup?userid='+userId))
                .success(function(data) {
                    if(data.code == 0){
                        service.state = 1;
                        service.messageList = data.content;
                    }else{
                        //alert("接口异常!");
                        var alertPopup = $ionicPopup.alert({
                            title:'接口异常!',
                            okType:'button-balanced',okText:'确定'
                        });
                        service.state = -1;
                    }
                    $rootScope.$broadcast( 'message.init' );
                });
        }
    }
    return service;
}]);

services.service( 'Address', [ '$rootScope', '$http','$ionicPopup','$timeout',function( $rootScope,$http,$ionicPopup,$timeout) {
    var service = {
        addressList : [],
        state : {},
        address_search:function(userId){
            $http.get(API.url('address/search?userid='+userId))
                .success(function(data) {
                    if(data.code == 0){
                        service.state = 1;
                        service.addressList = data.content[0];
                    }else{
                        var alertPopup = $ionicPopup.alert({
                            title:'接口异常!',
                            okType:'button-balanced',okText:'确定'
                        });
                        service.state = -1;
                    }
                    $rootScope.$broadcast( 'address.search' );
                });
        },

        address_add:function(address,userId,place,id){
            $http.get(API.url('address/insert?' +
            'userid='+userId+'&username='+encodeURI(encodeURI(address.username))+'&mobile='
            +address.mobile+'&zipcode=225000'+'&address='+encodeURI(encodeURI(place))+'&tcd='+id))
                .success(function(data) {
                    if(data.code == 0){
                        service.state = 1;
                        var alertPopup = $ionicPopup.alert({
                            title:'添加成功!',
                            okType:'button-balanced',okText:'确定'
                        });
                        $timeout(function() {
                            alertPopup.close(); //close the popup after 1 seconds for some reason
                        }, 1000);
                    }else{
                        var alertPopup = $ionicPopup.alert({
                            title:'添加失败!',
                            okType:'button-balanced',okText:'确定'
                        });
                        $timeout(function() {
                            alertPopup.close(); //close the popup after 1 seconds for some reason
                        }, 1000);
                        service.state = -1;
                    }
                    $rootScope.$broadcast( 'address.add' );
                });
        },

        address_modify:function(address,userId){
            $http.get(API.url('address/update?' +
            'userid='+userId+'&username='+encodeURI(encodeURI(address.username))+'&mobile='
            +address.mobile+'&zipcode=225000'+'&address='+encodeURI(encodeURI(address.address))+'&tcd='+address.tcd+'&id='+address.id))
                .success(function(data) {
                    if(data.code == 0){
                        service.state = 1;
                        $rootScope.$broadcast( 'address.modify' );
                    }else{
                        var alertPopup = $ionicPopup.alert({
                            title:'修改失败!',
                            okType:'button-balanced',okText:'确定'
                        });
                        $timeout(function() {
                            alertPopup.close(); //close the popup after 1 seconds for some reason
                        }, 1000);
                        service.state = -1;
                        $rootScope.$broadcast( 'address.modify.fail' );
                    }

                });
        },
        address_delete:function(id){
            $http.get(API.url('address/delete?' +
            'id='+id))
                .success(function(data) {
                    if(data.code == 0){
                        service.state = 1;
                        //var alertPopup = $ionicPopup.alert({
                        //    title:'删除成功!',
                        //    okType:'button-balanced',okText:'确定'
                        //});
                        //$timeout(function() {
                        //    alertPopup.close(); //close the popup after 1 seconds for some reason
                        //}, 1000);
                        $rootScope.$broadcast( 'address.delete' );
                    }else{
                        var alertPopup = $ionicPopup.alert({
                            title:'修改失败!',
                            okType:'button-balanced',okText:'确定'
                        });
                        $timeout(function() {
                            alertPopup.close(); //close the popup after 1 seconds for some reason
                        }, 1000);
                        service.state = -1;
                        $rootScope.$broadcast( 'address.delete.fail' );
                    }

                });
        }
    }
    return service;
}]);

services.service( 'Order', [ '$rootScope', '$http','$ionicPopup','$timeout',function( $rootScope,$http,$ionicPopup,$timeout) {
    var service = {
        orderList : [],orderList1 : [],orderList2 : [],orderList3 : [],
        orderInfo : {},
        state : {},
        submit_order:function(productList,addressList,userId,payway,order_type){
            for(var i = 0;i < productList.length;i++){
                if(i == 0){
                    var pro_id = productList[i].id;
                    var pro_cnt = productList[i].pro_cnt;
                }else{
                    pro_id = pro_id +','+ productList[i].id  ;
                    pro_cnt =  pro_cnt +','+ productList[i].pro_cnt  ;
                }
            }

            if(payway == '账户支付'){
                payway = -1;
            }else{
                payway = 'alipay';
            }
            $http.get(API.url('addOrder?' +
            'userid='+userId+'&pro_id='+pro_id+'&user_name='+encodeURI(addressList.username)+'&user_msisdn='+
            addressList.mobile+'&user_zipcode=225000&user_addr='+encodeURI(addressList.address)+'&pro_cnt='+pro_cnt+
                    '&content='+encodeURI(productList.words)+'&order_type='+order_type+'&pay_way='+payway+'&deliveryid='+addressList.tcd))
                .success(function(data) {
                    if(data.code == 0){
                        service.state = 1;
                        service.orderInfo = data;
                    }else{
                        var alertPopup = $ionicPopup.alert({
                            title:'提交失败!',
                            okType:'button-balanced',okText:'确定'
                        });
                        $timeout(function() {
                            alertPopup.close(); //close the popup after 1 seconds for some reason
                        }, 1000);
                        service.state = -1;
                    }
                    $rootScope.$broadcast( 'order.submit' );
                });
        },

        //query_order:function(userId){
        //    $http.get(API.url('myOrderGroup?userid='+userId))
        //        .success(function(data) {
        //            if(data.code == 0){
        //                service.state = 1;
        //                service.orderList = data.content;
        //            }else{
        //                alert("接口异常!");
        //                service.state = -1;
        //            }
        //            $rootScope.$broadcast( 'order.query' );
        //        });
        //},
        query_order:function(userId){
            $http.get(API.url('myOrderGroup?userid='+userId+'&state=1'))
                .success(function(data) {
                    if(data.code == 0){
                        service.state = 1;
                        service.orderList1 = data.content;
                    }else{
                        var alertPopup = $ionicPopup.alert({
                            title:'接口异常!',
                            okType:'button-balanced',okText:'确定'
                        });
                        service.state = -1;
                    }
                    $rootScope.$broadcast( 'order.query' );
                });
            $http.get(API.url('myOrderGroup?userid='+userId+'&state=2'))
                .success(function(data) {
                    if(data.code == 0){
                        service.state = 1;
                        service.orderList2 = data.content;
                    }else{
                        //alert("接口异常!");
                        var alertPopup = $ionicPopup.alert({
                            title:'接口异常!',
                            okType:'button-balanced',okText:'确定'
                        });
                        service.state = -1;
                    }
                });
            $http.get(API.url('myOrderGroup?userid='+userId+'&state=3'))
                .success(function(data) {
                    if(data.code == 0){
                        service.state = 1;
                        service.orderList3 = data.content;
                    }else{
                        //alert("接口异常!");
                        var alertPopup = $ionicPopup.alert({
                            title:'接口异常!',
                            okType:'button-balanced',okText:'确定'
                        });
                        service.state = -1;
                    }
                });
        },

        query_order_state:function(userId,state){
            $http.get(API.url('myOrderGroup?userid='+userId+'&state='+state))
                .success(function(data) {
                    if(data.code == 0){
                        service.state = 1;
                        service.orderList = data.content;
                    }else{
                        //alert("接口异常!");
                        var alertPopup = $ionicPopup.alert({
                            title:'接口异常!',
                            okType:'button-balanced',okText:'确定'
                        });
                        service.state = -1;
                    }
                    $rootScope.$broadcast( 'order.query_state' );
                });
        },

        cancel_order:function(userId,order){
            $http.get(API.url('delOrder?userid='+userId+'&orderid='+order.orderid))
                .success(function(data) {
                    if(data.code == 0){
                        service.state = 1;
                        var alertPopup = $ionicPopup.alert({
                            title:'取消成功!',
                            okType:'button-balanced',okText:'确定'
                        });
                        $timeout(function() {
                            alertPopup.close(); //close the popup after 1 seconds for some reason
                        }, 1500);
                    }else{
                        var alertPopup = $ionicPopup.alert({
                            title:'取消失败!',
                            okType:'button-balanced',okText:'确定'
                        });
                        $timeout(function() {
                            alertPopup.close(); //close the popup after 1 seconds for some reason
                        }, 1500);
                        service.state = -1;
                    }
                    $rootScope.$broadcast( 'order.cancel' );
                });
        }

    }
    return service;
}]);

services.service( 'Pay', [ '$rootScope', '$http','Ds','$ionicPopup','$timeout',function( $rootScope,$http,Ds,$ionicPopup,$timeout) {
    var service = {
        total : {},
        state : {},
        balance_pay:function(orderInfo,userId,pay_amount,pay_kamount,pay_point){
            alert(orderInfo.orderid+'&fee='+orderInfo.totalmoney+'&userid='+userId+'&pay_way=-1'+'&pay_amount='+pay_amount+'&pay_kamount='+pay_kamount+'&pay_point='+pay_point*100)
            $http.get(API.url('payIOS?orderid='+orderInfo.orderid+'&fee='+orderInfo.totalmoney+'&userid='+userId+'&pay_way=-1'+'&pay_amount='+pay_amount+'&pay_kamount='+pay_kamount+'&pay_point='+pay_point*100))
                .success(function(data) {
                    if(data.code == 0){
                        service.total = orderInfo.total;
                        service.state = 1;
                        var alertPopup = $ionicPopup.alert({
                            title:'支付成功!',
                            okType:'button-balanced',okText:'确定'
                        });
                        $timeout(function() {
                            alertPopup.close(); //close the popup after 1 seconds for some reason
                        }, 1500);
                    }else{
                        var alertPopup = $ionicPopup.alert({
                            title:'接口异常!',
                            okType:'button-balanced',okText:'确定'
                        });
                        service.state = -1;
                    }
                    $rootScope.$broadcast( 'pay.success' );
                });
            }
    }
    return service;
}]);

services.service( 'Place', [ '$rootScope', '$http','Ds','$ionicPopup','$timeout',function( $rootScope,$http,Ds,$ionicPopup,$timeout) {
    var service = {
        placeList : [],
        place:function(){
            $http.get(API.url('delivery'))
                .success(function(data) {
                    if(data.code == 0){
                        service.placeList = data.content;
                    }else{
                        var alertPopup = $ionicPopup.alert({
                            title:'接口异常!',
                            okType:'button-balanced',okText:'确定'
                        });
                    }
                    $rootScope.$broadcast( 'place.success' );
                });
        }
    }
    return service;
}]);
