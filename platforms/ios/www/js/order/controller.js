appControllers
.controller('OrderCtrl',
    ['$scope', '$http','$ionicLoading','$ionicHistory','Address','Ds','Login','$ionicModal','$state','$ionicPopup','ProductDetail','$stateParams','$filter','Order','Pay','Place','$ionicPopover','$cordovaToast',
        function($scope, $http,$ionicLoading,$ionicHistory,Address,Ds,Login,$ionicModal,$state,$ionicPopup,ProductDetail,$stateParams,$filter,Order,Pay,Place,$ionicPopover,$cordovaToast) {

            var isLogin = Ds.has('user');
            if(!isLogin){
                $state.go('tab.person');
                return;
            }else{
                var userid = Ds.get("user").userid;
                //查询地址
                Address.address_search(userid);
            }

            $scope.addressList = {};
            $scope.addressLists = [];

            if(!$scope.index){
                $scope.index = 0;
            }
            //初始化地址监听
            //..todo大坑待研究
            $scope.$on('address.search',function(event){
                if(Address.addressList.length == 0){
                    $scope.addressList = '';
                }else{
                    $scope.addressList =  Address.addressList[$scope.index];
                }
                $scope.addressLists = Address.addressList;
            });

            $scope.productList = [];
            if(Ds.has("cart.order")){
                $scope.productList = Ds.get("cart.order").list;
            }

            //查询商品
            if($scope.productList.length == 0){
                ProductDetail.productDetail($stateParams.productId);
            }else{
                $filter('imgFilter')($scope.productList);
                $scope.product_oprice = Ds.get("cart.order").amount;
            }

            //初始化页面广播监听
            $scope.$on('productDetail.init',function(event){
                $filter('imgFilter')(ProductDetail.content);
                $scope.productList[0] = ProductDetail.content;
                $scope.productList[0].pro_cnt = $stateParams.cnt;
                if($scope.productList[0].limited_flag == 0){
                    $scope.product_oprice = $filter('formatNumber')(($scope.productList[0].uprice)*$scope.productList[0].pro_cnt,'#.000');
                }else{
                    $scope.product_oprice = $filter('formatNumber')(($scope.productList[0].aprice)*$scope.productList[0].pro_cnt,'#.000');
                }

            });

            $scope.first_address = function () {
                //跳转至新增地址页面
                $ionicModal.fromTemplateUrl('add_address.html', {
                    scope: $scope,
                    animation: 'slide-in-up'
                }).then(function(modal) {
                    $scope.modal = modal;
                    $scope.modal.show();
                });
            }

            //添加地址
            $scope._add_address = function (address) {
                if(address.address == undefined || address.address == '选择自提点'){
                    $cordovaToast.showShortCenter('请选择自提点!');
                }else if(!/^[1][3,4,5,7,8][0-9]{9}$/.test(address.mobile)){
                    $cordovaToast.showShortCenter('请正确填写手机号码!');
                }else{
                    Address.address_add(address,userid);
                }
            }

            //添加地址监听
            $scope.$on('address.add',function(event){
                $scope.modal.hide().then(function () {
                    Address.address_search(userid);
                })
            });

            //选择地址
            $scope.query_address = function () {
                $ionicModal.fromTemplateUrl('query_address.html',{
                    scope:$scope,
                    animation:'slide-in-up'
                }).then(function (modal) {
                    $scope.modal4 = modal;
                    $scope.modal4.show();
                })
            }

            $scope.choose_address = function (index) {
                $scope.index = index;
                $scope.modal4.hide().then(function () {
                    $scope.addressList = {};
                    Address.address_search(userid);
                })
            };

            $scope.address_single = {};
            $scope.address_single.address='选择自提点';
            //修改地址
            $scope.modify_address = function (address) {
                var userAdd = address;
                $scope.address_single = address;
                $scope.address_place1 = '邗江区';
                $scope.address_single.username = decodeURI(userAdd.username);
                $scope.address_single.mobile = userAdd.mobile;
                $scope.address_single.address  = decodeURI(userAdd.address);
                $scope.address_single.tcd = userAdd.tcd;
                //跳转至新增地址页面
                $ionicModal.fromTemplateUrl('modify_address.html', {
                    scope: $scope,
                    animation: 'slide-in-up'
                }).then(function(modal) {
                    $scope.modal2 = modal;
                    $scope.modal2.show();
                });
            }

            //保存修改地址
            $scope._modify_address = function (address) {
                if(address.address == undefined || address.address == '选择自提点'){
                    $cordovaToast.showShortCenter('请选择自提点!');
                    return false;
                }
                Address.address_modify(address,userid);
            }

            //修改地址监听
            $scope.$on('address.modify',function(event){
                $cordovaToast.showShortBottom('修改成功!')
                $scope.modal2.hide().then(function () {
                    Address.address_search(userid);
                })
                $scope.address_place = '选择自提点';
            });

            //自提点
            $scope.showPlace = function () {
                $ionicModal.fromTemplateUrl('myself_place.html',{
                    scope:$scope,
                    animation:'slide-in-up'
                }).then(function (modal) {
                    $scope.modal3 = modal;
                    $scope.modal3.show();
                })
            }

            //自提点
            Place.place();
            $scope.$on('place.success', function () {
                $scope.placeList = Place.placeList;
            })

            //自提点
            $scope.myself_place_back = function () {
                $scope.modal3.hide();
            }

            //选择自提点
            $scope.choose = function (place) {
                $scope.address_single.address = place.title;
                $scope.address_single.tcd = place.id;
                $scope.modal3.hide();
            }

            $scope.query_back = function () {
                $scope.modal4.hide();
            }

            var indexNum = '';
            //删除地址
            $scope.delete_address = function (address,index){
                indexNum = index;
                Address.address_delete(address.id);
                event.stopPropagation();
            }
            
            $scope.$on('address.delete', function () {
                $scope.addressLists.splice(indexNum,1);
                Address.address_search(userid);
            })


            //选择支付方式
            //$scope.paymodel = [{"val":"在线支付","key":"在线支付"},{"val":"账户支付","key":"账户支付"}];
            //$scope.payway = "在线支付";
            //$scope.change = function(payway){
            //    $scope.payway = payway;
            //    pay_way = $scope.payway;
            //}

            //选择支付方式
            var pay_way = $scope.pay_way = '在线支付';
            $scope.selectWay = function ($event) {
                user_pay = 0;
                $scope.popover.show($event)
            }

            $ionicPopover.fromTemplateUrl('payway.html',{
                scope:$scope
            }).then(function (popover) {
                $scope.popover = popover;
            })

            $scope.ali = {};
            $scope.ali.checked = true;
            $scope.balance = {};
            $scope.balance.name = 'balance';
            $scope.points = {};
            $scope.points.name = 'points';
            $scope.card = {};
            $scope.card.name = 'card';

            if(Ds.has('user')){
                $scope.balance.all = Ds.get('user').amount;
                $scope.points.all = Ds.get('user').point;
                $scope.card.all  = Ds.get('user').kamount;
            }
            $scope.select_ali = function () {
                if($scope.ali.checked == true){
                    $scope.balance.checked = false;
                    $scope.points.checked = false;
                    $scope.card.checked = false;
                }
                if($scope.ali.checked == false){
                    $scope.ali.checked = true;
                }
            }

            var user_pay = 0;
            $scope.select_count = function () {
                if($scope.ali.checked == true){
                    $scope.ali.checked = false;
                }
            }

            var balance_pay = 0;
            var points_pay = 0;
            var card_pay = 0;
            var reg = /^[0-9]+(.[0-9]{2})?$/;
            $scope.$on('popover.hidden', function () {
               if($scope.ali.checked == true){
                   pay_way = $scope.pay_way ='在线支付';
               }else{
                   pay_way = $scope.pay_way ='账户支付';
                   if($scope.balance.checked == true && $scope.balance.amount != undefined){
                       if($scope.balance.amount > $scope.balance.all){
                           $scope.balance.amount = $scope.balance.all;
                       }
                       balance_pay =  $scope.balance.amount;
                       user_pay += $scope.balance.amount;
                   }else if($scope.balance.checked == true && $scope.balance.amount == undefined ){
                       balance_pay = $scope.balance.all;
                       user_pay += $scope.balance.all;
                   }else if($scope.balance.checked == false){
                       balance_pay = 0
                   }
                   if($scope.points.checked == true && $scope.points.amount != undefined){
                       if($scope.points.amount > $scope.points.all){
                           $scope.points.amount = $scope.points.all;
                       }
                       points_pay = $scope.points.amount/100;
                       user_pay += $scope.points.amount/100;
                   }else if($scope.points.checked == true && $scope.points.amount == undefined ){
                       points_pay = $scope.points.all/100;
                       user_pay += $scope.points.all/100;
                   }else if($scope.points.checked == false){
                       points_pay = 0;
                   }
                   if($scope.card.checked == true && $scope.card.amount != undefined){
                       if($scope.card.amount > $scope.card.all){
                           $scope.card.amount = $scope.card.all;
                       }
                       card_pay = $scope.card.amount;
                       user_pay += $scope.card.amount;
                   }else if($scope.card.checked == true && $scope.card.amount == undefined ){
                       card_pay = $scope.card.all;
                       user_pay += $scope.card.all;
                   }else if($scope.card.checked == false){
                       card_pay = 0;
                   }
                   if(user_pay < $scope.product_oprice){
                       var alertPopup = $ionicPopup.alert({
                           title:'账户钱不够哦',
                           okType:'button-balanced',okText:'确定'
                       })
                   }else{
                       if(points_pay > $scope.product_oprice){
                           points_pay = $scope.product_oprice;
                           card_pay = 0;
                           balance_pay = 0;
                       }else if(card_pay > $scope.product_oprice){
                           card_pay = ($scope.product_oprice - points_pay).toFixed(2);
                           balance_pay = 0;
                       }else if(card_pay < $scope.product_oprice){
                           balance_pay = ($scope.product_oprice - points_pay - card_pay).toFixed(2);
                       }
                   }
               }
            })

            var order_type = false;
            var length = 0;
            //提交订单
            $scope.submit_order = function (productList,addressList) {
                if(pay_way == ''){
                    var alertPopup = $ionicPopup.alert({
                        title:'请选择支付方式!',
                        okType:'button-balanced',okText:'确定'
                    });
                }else if(pay_way == '账户支付' && user_pay < $scope.product_oprice){
                    var alertPopup = $ionicPopup.alert({
                        title:'账户钱不够哦',
                        okType:'button-balanced',okText:'确定'
                    })
                }else{
                    if($stateParams.cnt != null){
                        $scope.productList[0].pro_cnt = $stateParams.cnt;
                        order_type = 1;
                    }else{
                        order_type = 2;
                    }
                    if(productList.words == undefined){
                        productList.words = '';
                    }
                    length = productList.length;
                    Order.submit_order(productList,addressList,userid,pay_way,order_type);
                }
            }

            //提交订单监听
            $scope.$on('order.submit',function(event){
                if(Ds.has('fWhere') && Ds.get('fWhere')=='cart'){
                    $scope.$emit('ChangeCartcnt',length)
                }
                Ds.remove("cart.order");
                var orderInfo = Order.orderInfo;
                if(pay_way == "在线支付"){
                    if(Order.state == 1){
                        var confirmPopup = $ionicPopup.confirm({
                            title: '是否现在去支付？',
                            okType:'button-balanced',okText:'确定',
                            cancelType:'button-balanced',cancelText:'取消'
                        });
                        confirmPopup.then(function(res) {
                            if(res) {
                                //TODO: 修改支付金额  orderInfo.totalmoney
                                YFPay.alipay(function () {
                                    $state.go('state_order',{state:2});
                                }, function () {
                                    $state.go('state_order',{state:1});
                                },[orderInfo.orderid,'一日三顿','一日三顿',0.01]);
                            } else {
                                $state.go('all_order');
                            }
                        });
                    }
                }else{
                    if(Order.state == 1){
                        var confirmPopup = $ionicPopup.confirm({
                            title: "是否使用账户支付？",
                            okType:'button-balanced',okText:'确定',
                            cancelType:'button-balanced',cancelText:'取消'
                        });
                        confirmPopup.then(function(res) {
                            if(res) {
                                if(Ds.get("user").amount < orderInfo.totalmoney){
                                    var alertPopup = $ionicPopup.alert({
                                        title:'余额不足!',
                                        okType:'button-balanced',okText:'确定'
                                    });
                                    $state.go('all_order');
                                }else {
                                    Pay.balance_pay(orderInfo, userid,balance_pay,card_pay,points_pay);
                                }
                            } else {
                                $state.go('all_order');
                            }
                        });
                    }
                }
            });

            //账户支付监听
            $scope.$on('pay.success', function (event) {
                if(Pay.state == 1){
                    //Login.query(userid);
                    $state.go('state_order',{state:2});
                }
            });

            $scope.add_address_back = function () {
                $scope.modal.hide();
            }
            $scope.modify_address_back = function () {
                $scope.modal2.hide();
            }

            $scope.order_back = function () {
                if(Ds.has('cart.order')){
                    Ds.remove("cart.order");
                }
                history.back();
                //$ionicHistory.goBack();
            }

            $scope.$on('$stateChangeSuccess', function ($event,toState, toParams, fromState, fromParams) {
                if(fromState.name == 'product-detail'){
                    Ds.set('fWhere','detail');
                }else if(fromState.name == 'tab.cart' || fromState.name == 'product-detail-cart'){
                    Ds.set('fWhere','cart');
                }
            })
}]);

//查询所有订单
appControllers
    .controller('QueryOrderCtrl',
    [ '$scope', '$ionicLoading','Order','$stateParams','$ionicHistory','Ds','$state','$ionicPopup','Pay','Login','$ionicPopover',
        function($scope,$ionicLoading,Order,$stateParams,$ionicHistory,Ds,$state,$ionicPopup,Pay,Login,$ionicPopover){

            var userid = Ds.get("user").userid;

            Order.query_order(userid);

            //查询订单监听
            $scope.$on('order.query', function (event) {
                $ionicLoading.hide();
                $scope.orderList1 = Order.orderList1;
                $scope.orderList2 = Order.orderList2;
                $scope.orderList3 = Order.orderList3;
            })

            $scope.orderList_back = function () {
                $state.go('tab.person');
            }

            //支付未付款订单
            //$scope.pay_order = function (order) {
            //    var myPopup = $ionicPopup.show({
            //        template: '',
            //        title: '选择支付方式',
            //        subTitle: '',
            //        scope: $scope,
            //        buttons: [
            //            { text: '在线支付',
            //                type: 'button-balanced',
            //                onTap: function() {
            //                    return false;
            //                }},
            //            {
            //                text: '账户支付',
            //                type: 'button-balanced',
            //                onTap: function() {
            //                        return true;
            //                }
            //            }
            //        ]
            //    });
            //    myPopup.then(function(res) {
            //            if(res){
            //                //账户支付
            //                var confirmPopup = $ionicPopup.confirm({
            //                    title: "是否使用账户支付？",
            //                    okType:'button-balanced',okText:'确定',
            //                    cancelType:'button-balanced',cancelText:'取消'
            //                });
            //                confirmPopup.then(function(res) {
            //                    if(res) {
            //                        if(Ds.get("user").amount < order.totalmoney){
            //                            var alertPopup = $ionicPopup.alert({
            //                                title:'余额不足!',
            //                                okType:'button-balanced',okText:'确定'
            //                            });
            //                            $state.go('all_order');
            //                        }else {
            //                            Pay.balance_pay(order, userid);
            //                        }
            //                    } else {
            //                        $state.go('all_order');
            //                    }
            //                });
            //            }else{
            //                //在线支付
            //                var confirmPopup = $ionicPopup.confirm({
            //                    title: '是否现在去支付？',
            //                    okType:'button-balanced',okText:'确定',
            //                    cancelType:'button-balanced',cancelText:'取消'
            //                });
            //                confirmPopup.then(function(res) {
            //                    if(res) {
            //                        YFPay.alipay(function(){
            //                                $state.go('state_order',{state:2})
            //                            },
            //                            function(){
            //                                $state.go('all_order');
            //                                     //order.totalmoney
            //                            },[order.orderid,'一日三顿','一日三顿',0.01]);
            //                    } else {
            //                        $state.go('all_order');
            //                    }
            //                });
            //            }
            //    });
            //}

            //支付未付款订单--选择支付方式
            var order = {};
            $ionicPopover.fromTemplateUrl('payway.html',{
                scope:$scope
            }).then(function (popover) {
                $scope.popover = popover;
            })

            $scope.pay_order = function (orders,$event) {
                $event.stopPropagation();
                order= orders;
                var pay_way = $scope.pay_way = '在线支付';
                user_pay = 0;
                $scope.popover.show($event);
            }


            $scope.ali = {};
            $scope.ali.checked = true;
            $scope.balance = {};
            $scope.balance.name = 'balance';
            $scope.points = {};
            $scope.points.name = 'points';
            $scope.card = {};
            $scope.card.name = 'card';

            if(Ds.has('user')){
                $scope.balance.all = Ds.get('user').amount;
                $scope.points.all = Ds.get('user').point;
                $scope.card.all  = Ds.get('user').kamount;
            }
            $scope.select_ali = function () {
                if($scope.ali.checked == true){
                    $scope.balance.checked = false;
                    $scope.points.checked = false;
                    $scope.card.checked = false;
                }
                if($scope.ali.checked == false){
                    $scope.ali.checked = true;
                }
            }

            var user_pay = 0;
            $scope.select_count = function () {
                if($scope.ali.checked == true){
                    $scope.ali.checked = false;
                }
            }

            var balance_pay = 0;
            var points_pay = 0;
            var card_pay = 0;
            $scope.$on('popover.hidden', function () {
                if($scope.ali.checked == true){
                    pay_way = $scope.pay_way ='在线支付';
                    var myPopup = $ionicPopup.show({
                        template: '',
                        title: '是否现在支付',
                        subTitle: '',
                        scope: $scope,
                        buttons: [
                            { text: '否',
                                type: 'button-balanced',
                                onTap: function() {
                                    return false;
                                }},
                            {
                                text: '是',
                                type: 'button-balanced',
                                onTap: function() {
                                    return true;
                                }
                            }
                        ]
                    });
                    myPopup.then(function(res) {
                        if(res){
                            //在线支付
                            if(res) {
                                YFPay.alipay(function(){
                                        $state.go('state_order',{state:2});
                                    },
                                    function(){
                                        $state.go('state_order',{state:1});
                                        //order.totalmoney
                                    },[order.orderid,'一日三顿','一日三顿',0.01]);
                            } else {
                                $state.go('state_order',{state:1});
                            }
                        }else{
                            return false;
                        }
                    });
                }else{
                    pay_way = $scope.pay_way ='账户支付';
                    if($scope.balance.checked == true && $scope.balance.amount != undefined){
                        balance_pay =  $scope.balance.amount;
                        user_pay += $scope.balance.amount;
                    }else if($scope.balance.checked == true && $scope.balance.amount == undefined ){
                        balance_pay = $scope.balance.all;
                        user_pay += $scope.balance.all;
                    }else if($scope.balance.checked == false){
                        balance_pay = 0
                    }
                    if($scope.points.checked == true && $scope.points.amount != undefined){
                        points_pay = $scope.points.amount/100;
                        user_pay += $scope.points.amount/100;
                    }else if($scope.points.checked == true && $scope.points.amount == undefined ){
                        points_pay = $scope.points.all/100;
                        user_pay += $scope.points.all/100;
                    }else if($scope.points.checked == false){
                        points_pay = 0;
                    }
                    if($scope.card.checked == true && $scope.card.amount != undefined){
                        card_pay = $scope.card.amount;
                        user_pay += $scope.card.amount;
                    }else if($scope.card.checked == true && $scope.card.amount == undefined ){
                        card_pay = $scope.card.all;
                        user_pay += $scope.card.all;
                    }else if($scope.card.checked == false){
                        card_pay = 0;
                    }
                    if(user_pay < order.totalmoney){
                        var alertPopup = $ionicPopup.alert({
                            title:'账户钱不够哦',
                            okType:'button-balanced',okText:'确定'
                        })
                    }else if(pay_way == '账户支付'){
                        if(points_pay > order.totalmoney){
                            points_pay = order.totalmoney;
                            card_pay = 0;
                            balance_pay = 0;
                        }else if(card_pay > order.totalmoney){
                            card_pay = (order.totalmoney - points_pay).toFixed(2);
                            balance_pay = 0;
                        }else if(card_pay < order.totalmoney){
                            balance_pay = (order.totalmoney - points_pay - card_pay).toFixed(2);
                        }
                        var myPopup = $ionicPopup.show({
                            template: '',
                            title: '是否现在支付',
                            subTitle: '',
                            scope: $scope,
                            buttons: [
                                { text: '否',
                                    type: 'button-balanced',
                                    onTap: function() {
                                        return false;
                                    }},
                                {
                                    text: '是',
                                    type: 'button-balanced',
                                    onTap: function() {
                                        return true;
                                    }
                                }
                            ]
                        });
                        myPopup.then(function(res) {
                            if(res){
                                //账户支付
                                Pay.balance_pay(order,userid,balance_pay,card_pay,points_pay);
                            }else{
                                return false;
                            }
                        });
                    }
                }
            })

            //账户支付监听
            $scope.$on('pay.success', function (event) {
                if(Pay.state == 1){
                    Login.query(userid);
                    $state.go('state_order',{state:2});
                }
            });

            //取消订单
            $scope.cancel_order = function (order,$event) {
                var confirmPopup = $ionicPopup.confirm({
                    title: '确认取消该订单吗？',
                    okType:'button-balanced',okText:'确定',
                    cancelType:'button-balanced',cancelText:'取消'
                });
                confirmPopup.then(function(res) {
                    if(res) {
                        Order.cancel_order(userid,order);
                    } else {
                        return false;
                    }
                });
                $event.stopPropagation();
            }

            $scope.$on('order.cancel', function (event) {
                Order.query_order(userid);
                $scope.orderList1 = Order.orderList1;
            })

            $scope.detail_no = function (orderid) {
                $state.go('orderDetail',{orderid:orderid});
            }
            
            //$scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            //    alert(toState.name)
            //})
        }]);

//查询类别订单
appControllers
    .controller('QuerySingleOrderCtrl',
    [ '$scope', '$ionicLoading','Order','$stateParams','$ionicHistory','Ds','$state','$ionicPopup','Pay','$ionicPopover','Login',
        function($scope,$ionicLoading,Order,$stateParams,$ionicHistory,Ds,$state,$ionicPopup,Pay,$ionicPopover,Login){
            $ionicLoading.show({template: '加载中...'});
            var userid = Ds.get("user").userid;

            Order.query_order_state(userid,$stateParams.state);

            //查询订单监听
            $scope.$on('order.query_state', function (event) {
                $ionicLoading.hide();
                $scope.orderList = Order.orderList;
            })

            $scope.orderList_back = function () {
                $state.go('tab.person');
            }

            //支付未付款订单
            //$scope.pay_order = function (order) {
            //    var myPopup = $ionicPopup.show({
            //        template: '',
            //        title: '选择支付方式',
            //        subTitle: '',
            //        scope: $scope,
            //        buttons: [
            //            { text: '在线支付',
            //                type: 'button-balanced',
            //                onTap: function() {
            //                    return false;
            //                }},
            //            {
            //                text: '账户支付',
            //                type: 'button-balanced',
            //                onTap: function() {
            //                    return true;
            //                }
            //            }
            //        ]
            //    });
            //    myPopup.then(function(res) {
            //        if(res){
            //            //账户支付
            //            if(confirm("是否使用账户支付？")){
            //                if(Ds.get("user").amount < order.totalmoney){
            //                    //alert("余额不足");
            //                    var alertPopup = $ionicPopup.alert({
            //                        title:'余额不足!'
            //                    });
            //                    $state.go('all_order');
            //                }else {
            //                    Login.query(userid);
            //                    Pay.balance_pay(order, userid);
            //                }
            //            }else{
            //                $state.go('state_order',{state:1});
            //            }
            //        }else{
            //            //在线支付
            //            //TODO: 修改支付金额  orderInfo.total
            //            var confirmPopup = $ionicPopup.confirm({
            //                title: '是否现在去支付？',
            //                okType:'button-balanced',okText:'确定',
            //                cancelType:'button-balanced',cancelText:'取消'
            //            });
            //            confirmPopup.then(function(res) {
            //                if(res) {
            //                    YFPay.alipay(function(){
            //                            $state.go('state_order',{state:2});
            //                        },
            //                        function(){
            //                            $state.go('state_order',{state:1});
            //                            //order.totalmoney
            //                        },[order.orderid,'一日三顿','一日三顿',0.01]);
            //                } else {
            //                    $state.go('state_order',{state:1});
            //                }
            //            });
            //            }
            //
            //
            //    });
            //}

            //支付未付款订单--选择支付方式
            var order = {};
            $scope.pay_order = function (orders,$event) {
                $event.stopPropagation();
                order= orders;
                var pay_way = $scope.pay_way = '在线支付';
                user_pay = 0;
                $scope.popover.show($event);
            }
            $ionicPopover.fromTemplateUrl('payway.html',{
                scope:$scope
            }).then(function (popover) {
                $scope.popover = popover;
            })

                $scope.ali = {};
                $scope.ali.checked = true;
                $scope.balance = {};
                $scope.balance.name = 'balance';
                $scope.points = {};
                $scope.points.name = 'points';
                $scope.card = {};
                $scope.card.name = 'card';

                if(Ds.has('user')){
                    $scope.balance.all = Ds.get('user').amount;
                    $scope.points.all = Ds.get('user').point;
                    $scope.card.all  = Ds.get('user').kamount;
                }
                $scope.select_ali = function () {
                    if($scope.ali.checked == true){
                        $scope.balance.checked = false;
                        $scope.points.checked = false;
                        $scope.card.checked = false;
                    }
                    if($scope.ali.checked == false){
                        $scope.ali.checked = true;
                    }
                }

                var user_pay = 0;
                $scope.select_count = function () {
                    if($scope.ali.checked == true){
                        $scope.ali.checked = false;
                    }
                }

                var balance_pay = 0;
                var points_pay = 0;
                var card_pay = 0;
                $scope.$on('popover.hidden', function () {
                    if($scope.ali.checked == true){
                        pay_way = $scope.pay_way ='在线支付';
                        var myPopup = $ionicPopup.show({
                            template: '',
                            title: '是否现在支付',
                            subTitle: '',
                            scope: $scope,
                            buttons: [
                                { text: '否',
                                    type: 'button-balanced',
                                    onTap: function() {
                                        return false;
                                    }},
                                {
                                    text: '是',
                                    type: 'button-balanced',
                                    onTap: function() {
                                        return true;
                                    }
                                }
                            ]
                        });
                        myPopup.then(function(res) {
                            if(res){
                                //在线支付
                                if(res) {
                                    YFPay.alipay(function(){
                                            $state.go('state_order',{state:2});
                                        },
                                        function(){
                                            $state.go('state_order',{state:1});
                                            //order.totalmoney
                                        },[order.orderid,'一日三顿','一日三顿',0.01]);
                                } else {
                                    $state.go('state_order',{state:1});
                                }
                            }else{
                                return false;
                            }
                        });
                    }else{
                        pay_way = $scope.pay_way ='账户支付';
                        if($scope.balance.checked == true && $scope.balance.amount != undefined){
                            balance_pay =  $scope.balance.amount;
                            user_pay += $scope.balance.amount;
                        }else if($scope.balance.checked == true && $scope.balance.amount == undefined ){
                            balance_pay = $scope.balance.all;
                            user_pay += $scope.balance.all;
                        }else if($scope.balance.checked == false){
                            balance_pay = 0
                        }
                        if($scope.points.checked == true && $scope.points.amount != undefined){
                            points_pay = $scope.points.amount/100;
                            user_pay += $scope.points.amount/100;
                        }else if($scope.points.checked == true && $scope.points.amount == undefined ){
                            points_pay = $scope.points.all/100;
                            user_pay += $scope.points.all/100;
                        }else if($scope.points.checked == false){
                            points_pay = 0;
                        }
                        if($scope.card.checked == true && $scope.card.amount != undefined){
                            card_pay = $scope.card.amount;
                            user_pay += $scope.card.amount;
                        }else if($scope.card.checked == true && $scope.card.amount == undefined ){
                            card_pay = $scope.card.all;
                            user_pay += $scope.card.all;
                        }else if($scope.card.checked == false){
                            card_pay = 0;
                        }
                        if(user_pay < order.totalmoney){
                            var alertPopup = $ionicPopup.alert({
                                title:'账户钱不够哦',
                                okType:'button-balanced',okText:'确定'
                            })
                        }else if(pay_way == '账户支付'){
                            if(points_pay > order.totalmoney){
                                points_pay = order.totalmoney;
                                card_pay = 0;
                                balance_pay = 0;
                            }else if(card_pay > order.totalmoney){
                                card_pay = (order.totalmoney - points_pay).toFixed(2);
                                balance_pay = 0;
                            }else if(card_pay < order.totalmoney){
                                balance_pay = (order.totalmoney - points_pay - card_pay).toFixed(2);
                            }
                            var myPopup = $ionicPopup.show({
                                template: '',
                                title: '是否现在支付',
                                subTitle: '',
                                scope: $scope,
                                buttons: [
                                    { text: '否',
                                        type: 'button-balanced',
                                        onTap: function() {
                                            return false;
                                        }},
                                    {
                                        text: '是',
                                        type: 'button-balanced',
                                        onTap: function() {
                                            return true;
                                        }
                                    }
                                ]
                            });
                            myPopup.then(function(res) {
                                if(res){
                                    //账户支付
                                    Pay.balance_pay(order,userid,balance_pay,card_pay,points_pay);
                                }else{
                                    return false;
                                }
                            });
                        }
                    }
                })

            //账户支付监听
            $scope.$on('pay.success', function (event) {
                if(Pay.state == 1){
                    Login.query(userid);
                    $state.go('state_order',{state:2});
                }
            });

            $scope.cancel_order = function (order,$event) {

                var confirmPopup = $ionicPopup.confirm({
                    title: '确认取消该订单吗？',
                    okType:'button-balanced',okText:'确定',
                    cancelType:'button-balanced',cancelText:'取消'
                });
                confirmPopup.then(function(res) {
                    if(res) {
                        Order.delete_order(userid,order);
                    } else {
                        return false;
                    }
                });

                //$event.preventDefault();
                $event.stopPropagation();
            }

            $scope.detail_no = function (orderid) {
                $state.go('orderDetail',{orderid:orderid});
            }

        }]);

//地址管理控制器
appControllers
    .controller('AddressCtrl',
    ['$scope','$ionicLoading','Order','$stateParams','$ionicHistory','Ds','$state','Address',
        function ($scope,$ionicLoading,Order,$stateParams,$ionicHistory,Ds,$state,Address) {
            var isLogin = Ds.has('user');
            if(!isLogin){
                $state.go('tab.person');
                return;
            }else{
                var userid = Ds.get("user").userid;
                //查询地址
                Address.address_search(userid);
            }


            //初始化地址监听
            $scope.$on('address.search',function(event){
                $scope.addressList = Address.addressList;
            });


            $scope.address_back = function () {
                history.back();
            }
        }
    ])

//订单详情
appControllers
    .controller('OrderDetailCtrl',['$scope','Order','$stateParams','$state',
        function ($scope,Order,$stateParams,$state) {
            Order.query_detail($stateParams.orderid);
            
            $scope.$on('order.detail', function () {
                $scope.orderDetailList = Order.orderDetail;
            })

            $scope.back = function () {
                history.back();
            }
    }])

