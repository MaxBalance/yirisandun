//var host ='http://dev.imap360.com:88/k2h/index.php/Api/';
var host ='http://dev.imap360.com:88/kh2server/index.php/Api/';
var API = {
    url:function(key){
        return host+key;
    }
};

//首页
allServices.service( 'Main', [ '$rootScope', '$http',function( $rootScope,$http ) {
    var service = {
        content : {},
        init:function(lon,lat){
            $http.get(API.url('Sys/door?&lon='+lon+'&lat='+lat))
                .success(function(data) {
                    service.content = data.data;
                    $rootScope.$broadcast( 'main.load' );
                });
        }
    }
    return service;
}]);

//饭店列表
allServices.service( 'Restaurant', [ '$rootScope', '$http',function( $rootScope,$http ) {
    var service = {
        content : [],
        init:function(lon,lat){
            $http.get(API.url('Restaurant/restList?uid=1&lon='+lon+'&lat='+lat))
                .success(function(data) {
                    service.content = data.data.rows;
                    $rootScope.$broadcast( 'restaurant.load' );
                });
        }
    }
    return service;
}]);

//饭店详情
allServices.service('RestaurantDetails',['$rootScope','$http',function($rootScope,$http){
    var service = {
        content:[],
        uid:{},
        restaurantDetail:function(rid){
            $http.get(API.url('Restaurant/restInfo?rid='+rid+'&uid=32'))
                .success(function(data){
                    service.content = data.data.rows[0];
                    $rootScope.$broadcast('restaurantDetail.load');
                })
        }
    }
    return service;
}]);

//菜品详情
allServices.service('FoodDetails',['$rootScope','$http',function($rootScope,$http){
    var service = {
        content:[],
        uid:{},
        foodDetail:function(rid){
            $http.get(API.url('Food/foodByR?rid='+rid+'&lat=33&lon=33'))
                .success(function(data){
                    service.content = data.data;
                    $rootScope.$broadcast('foodDetail.load');
                })
        }
    }
    return service;
}]);

allServices.service( 'Setting', [ '$rootScope', '$http',function( $rootScope,$http ) {
    var service = {
        content : {},
        version:function(user_flag){
            $http.get(API.url('Sys/version?user_flag='+user_flag))
                .success(function(data) {
                    service.content = data.data;
                    $rootScope.$broadcast( 'setting.version' );
                });
        },
        opinion:function(opinion){
            var content = encodeURIComponent(opinion.content) ;
            $http.get(API.url('Sys/opinion?content='+content+"&contact="+opinion.contact))
                .success(function(data){
                $rootScope.$broadcast('setting.opinion', data.code);
            });
        }
    }
    return service;
}]);

/*操作local storeage 的工具服务*/
allServices.service('Ds',function(){
    var _store = window.localStorage;
    return {
        has:function(_key){
            //localStorage();
            return null !== _store.getItem(_key);
        },
        clear:function(){
            _store.clear();
        },
        set:function(_key,_value){
            var item = {};
            item.type = typeof(_value);
            item.content = _value;
            _store.setItem(_key, JSON.stringify(item));
        },
        get:function(_key){
            var item = JSON.parse(_store.getItem(_key));

            return item.content;
        },

        remove:function(_key) {
            _store.removeItem(_key);
        }
    };
});

allServices.service( 'Tickets', [ '$rootScope', '$http',function( $rootScope,$http ) {
    var service = {
        content : {},
        all: function(uid) {
            $http.get(API.url('Invoice/myInvoice?uid='+uid))
                .success(function(data){
                    service.content = data.data;
                    $rootScope.$broadcast( 'tickets.mytickets' );
                })
        },
        remove: function(ticket) {
            service.content.rows.splice(service.content.rows.indexOf(ticket), 1);
            $http.get(API.url('Invoice/delInvoice?uid='+ticket.uid+'&ui_id='+ticket.id))
                .success(function(data){
                    $rootScope.$broadcast('ticket.del', data.code);
                })
        },
        add: function(ticket,uid){
            var title = encodeURIComponent(ticket.title);
            $http.get(API.url('Invoice/addInvoice?uid='+uid+"&invoice_title="+title))
                .success(function(data){
                    $rootScope.$broadcast('ticket.add', data.code);
                });
        },
        update: function(ticket){
            var title = encodeURIComponent(ticket.invoice_title);
            $http.get(API.url('Invoice/editInvoice?uid='+ticket.uid+"&ui_id="+ticket.id+"&invoice_title="+title))
                .success(function(data){
                    $rootScope.$broadcast('ticket.update', data.code);
                });
        }
    }
    return service;
}]);

allServices.service( 'Address', [ '$rootScope', '$http',function( $rootScope,$http ) {
    var service = {
        content : {},
        all: function(uid) {
            $http.get(API.url('Address/myAddress?uid='+uid))
                .success(function(data){
                    service.content = data.data;
                    $rootScope.$broadcast( 'address.show' );
                })
        },
        remove: function(address) {
            service.content.rows.splice(service.content.rows.indexOf(address), 1);
            $http.get(API.url('Address/delAddress?uid='+address.uid+'&aid='+address.aid))
                .success(function(data){
                    $rootScope.$broadcast('address.del', data.code);
                })
        },
        add: function(address,uid){
            var to_name = encodeURIComponent(address.to_name);
            var to_addr = encodeURIComponent(address.to_addr);
            $http.get(API.url('Address/addAddress?uid='+uid+"&to_name="+to_name+"&to_addr="+to_addr+"&to_phone="+address.to_phone+"&to_lon="+address.to_lon+"&to_lat="+address.to_lat))
                .success(function(data){
                    $rootScope.$broadcast('address.add', data.code);
                });
        },
        update: function(address){
            var title = encodeURIComponent(address.invoice_title);
            $http.get(API.url('Address/editAddress?uid='+address.uid+"&id="+address.id+"&to_name="+address.to_name+"&to_addr="+address.to_addr+"&to_phone="+address.to_phone+"&to_lon="+address.to_lon+"&to_lat="+address.to_lat))
                .success(function(data){
                    $rootScope.$broadcast('address.update', data.code);
                });
        }
    }
    return service;
}]);

allServices.service( 'Menu', [ '$rootScope', '$http',function( $rootScope,$http ) {
    var service = {
        content : {},
        cnt:{},
        myMenuCnt: function(uid) {
            $http.get(API.url('Menu/myMenuCnt?uid='+uid))
                .success(function(data){
                    service.cnt = data.data;
                    $rootScope.$broadcast( 'menu.myMenuCnt' );
                })
        },
        myMenu: function(uid,lon,lat) {
            $http.get(API.url('Menu/myMenu?uid='+uid+'&lon='+lon+'&lat='+lat))
                .success(function(data){
                    service.content = data.data;
                    $rootScope.$broadcast( 'menu.myMenu' );
                })
        },
        remove:function(menu,uid){
            service.content.rows.splice(service.content.rows.indexOf(menu), 1);
            $http.get(API.url('Menu/delMenu?uid='+uid+'&fid='+menu.fid))
                .success(function(data){
                    $rootScope.$broadcast('menu.del', data.code);
                })
        }
    }
    return service;
}]);

allServices.service( 'Foods', [ '$rootScope', '$http',function( $rootScope,$http ) {
    var service = {
        content : [],
        init:function(uid,lon,lat){
            $http.get(API.url('Food/foodByA?uid='+uid+'&lon='+lon+'&lat='+lat))
                .success(function(data) {
                    service.content = data.data.rows;
                    $rootScope.$broadcast( 'foods.load' );
                });
        },
        getFoodInfo1:function(foodid,uid){
            $http.get(API.url('Food/foodInfo?fid='+foodid+'&uid='+uid))
                .success(function(food) {
                    service.content = food.data;
                    $rootScope.$broadcast( 'foods.foodDetails');
                });
        }
    }
    return service;
}]);

allServices.service( 'Order', [ '$rootScope', '$http',function( $rootScope,$http ) {
    var service = {
        content : {},
        yfkContent : {},
        postOrder:function(orderInfo,uid){
            $http.get(API.url('Order/addOrderByCart?uid='+uid+'&to_id='+orderInfo.to_id+'&tableware='+orderInfo.tableware+'&book_time='+orderInfo.book_time+'&invoice_title='+orderInfo.invoice_title))
                .success(function(data) {
                    $rootScope.$broadcast( 'order.postOrder' , data.code);
                });
        },
        menuByDfk:function(uid,lon,lat){
            $http.get(API.url('Menu/menuByDfk?uid='+uid+'&lon='+lon+'&lat='+lat))
                .success(function(data) {
                    service.content = data.data;
                    $rootScope.$broadcast( 'order.menuByDfk' );
                });
        },
        menuByDfkInfo:function(menuByDfkInfo,uid,lon,lat){
            $http.get(API.url('Menu/menuByDfkInfo?uid='+uid+'&orderno='+menuByDfkInfo.orderno+'&lon='+lon+'&lat='+lat))
                .success(function(data) {
                    service.content = data.data;
                    $rootScope.$broadcast( 'order.menuByDfkInfo' );
                });
        },
        cancle:function(dfkOrder,uid){
            $http.get(API.url('Order/CancelOrder?uid='+uid+'&orderno='+dfkOrder.orderno))
                .success(function(data) {
                    $rootScope.$broadcast('order.cancle', data.code);
                });
        },
        menuByYfk:function(uid,lon,lat){
            $http.get(API.url('Menu/menuByYfk?uid='+uid+'&lon='+lon+'&lat='+lat))
                .success(function(data) {
                    service.yfkContent = data.data;
                    $rootScope.$broadcast( 'order.menuByYfk' );
                });
        },
        menuByYpj:function(uid,lon,lat){
            $http.get(API.url('Menu/menuByYpj?uid='+uid+'&lon='+lon+'&lat='+lat))
                .success(function(data) {
                    service.content = data.data;
                    $rootScope.$broadcast( 'order.menuByYpj' );
                });
        },
        addOrderComment:function(pjInfo){
            $http.get(API.url('Order/addOrderComment?flag='+pjInfo.flag+'&uid='+pjInfo.uid+'&orderno='+pjInfo.orderno+'&logi_lev='+pjInfo.logi_lev+'&desc_lev='+pjInfo.desc_lev+'&serv_lev='+pjInfo.serv_lev+'&content='+pjInfo.content))
                .success(function(data) {
                    $rootScope.$broadcast( 'order.addOrderComment' , data.code);
                });
        }
    }
    return service;
}]);

allServices.service( 'Login', [ '$rootScope', '$http','Ds',function( $rootScope,$http,Ds ) {
   var service = {
   content : {},
   uniteLogin:function(openid,opentype){
   $http.get(API.url('User/uniteLogin?openid='+openid+'&opentype='+opentype))
   .success(function(data) {
            if(data.code == 0){
            Ds.set("userid",data.data.rows[0].uid);
            $rootScope.$broadcast( 'login.success' );
            }else{
            $rootScope.$broadcast( 'login.fail' );
            }
            });
                               },
                               uniteLogout:function(){$rootScope.$broadcast( 'login.uniteLogout' );}

   }
                               return service;
}]);

//我的消息
allServices.service('Message',['$rootScope','$http', function ($rootScope,$http) {
    var service = {
        content : [],
        //查询消息
        init:function(uid){
        $http.get(API.url('Message/myMessage?uid='+uid))
            .success(function (data) {
                service.content = data.data;
                $rootScope.$broadcast('message.load');
            })
        },
        //读取消息
        read: function (uid,id) {
        $http.get(API.url('Message/isRead?uid='+uid+'&id='+id))
            .success(function (data) {
                $rootScope.$broadcast('message.read');
            })
        }
    }
    return service;
}])

//搜索
allServices.service('SearchFoods',['$rootScope','$http', function ($rootScope,$http) {
    var service = {
        content : [],
        search_food: function (keyword,lon,lat,uid) {
            $http.get(API.url('Food/foodByS?q='+keyword+'&lon='+lon+'&lat='+lat+'&uid='+uid))
                .success(function(data){
                    service.content = data.data.rows;
                    $rootScope.$broadcast('search_food.success')
                })
        },
        search_restaurant:function(fid,lon,lat){
            $http.get(API.url('Food/foodByF?fid='+fid+'&lon='+lon+'&lat='+lat))
                .success(function(data){
                    service.content = data.data;
                    $rootScope.$broadcast('search_restaurant.success')
                })
        }
    }
    return service;
}])

//jun..start 菜品操作
allServices.service( 'FoodsList', [ '$rootScope', '$http',function( $rootScope,$http ) {
    var service = {
        content : [],
        init:function(uid,lon,lat){
            $http.get(API.url('Food/foodByA?uid='+uid+'&lon='+lon+'&lat='+lat))
                .success(function(data) {
                    service.content = data.data.rows;
                    $rootScope.$broadcast( 'foods.load' );
                });
        },
        get:function(fid){
            return service.content[fid];
        }
    }
    return service;
}]);

allServices.service('FoodInfo',['$rootScope','$http',function($rootScope,$http){
    var service = {
        content:[],
        getFoodInfo:function(foodid,uid,lon,lat){
            $http.get(API.url('Food/foodInfo?fid='+foodid+'&uid='+uid+'&lon='+lon+'&lat='+lat))
                .success(function(data){
                    service.content = data.data.rows[0];
                    $rootScope.$broadcast('foodInfo.load');
                })
        },
        addCollect:function(uid,fid){
            $http.get(API.url('Collect/addCollect?flag=2&wid='+fid+'&uid='+uid))
                .success(function(data){
                    $rootScope.$broadcast('foodInfo.addCol',data.msg);
                })
        },
        ifCollect:function(uid,lon,lat,fid){
            $http.get(API.url('Collect/myCollect?uid='+uid+'&lon='+lon+'&lat='+lat))
                .success(function(data){

                    for(var i= 0;i<data.data.total;i++){
                        if(data.data.rows[i].fid==fid){
                            $rootScope.$broadcast('foodInfo.ifCol',true);
                            //break;
                            return;
                        }
                    }
                    $rootScope.$broadcast('foodInfo.ifCol',false);
                })
        },
        addMenuList:function(uid,fid){
            $http.get(API.url('Menu/addMenu?uid='+uid+'&fid='+fid))
                .success(function(data){
                    //alert(uid+fid+data.code);
                    $rootScope.$broadcast('foodInfo.addMenuList',data.code);
                })
        }
    }
    return service;
}]);
//jun..end

//我的收藏
allServices.service('MyCollects',['$rootScope','$http',function($rootScope,$http){
    var service = {
        content:[],
        getCollects:function(uid,lon,lat){
            $http.get(API.url('Collect/myCollect?uid='+uid+'&lon='+lon+'&lat='+lat))
                .success(function(data){
                    service.content = data.data.rows;
                    $rootScope.$broadcast('myCollects.load');
                })
        }
    }
    return service;
}]);
