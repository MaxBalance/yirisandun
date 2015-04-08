appControllers
.controller('OrderCtrl',
    ['$scope', '$http','$ionicLoading','$ionicHistory','Address','Ds','Login','$ionicModal','$state','$ionicPopup','ProductDetail','$stateParams','$filter','Order','Pay','Place',
        function($scope, $http,$ionicLoading,$ionicHistory,Address,Ds,Login,$ionicModal,$state,$ionicPopup,ProductDetail,$stateParams,$filter,Order,Pay,Place) {

            var isLogin = Ds.has('user');
            if(!isLogin){
                //location.href="#/tab/person";
                $state.go('tab.person');
                return;
            }else{
                var userid = Ds.get("user").userid;
                //查询地址
                Address.address_search(userid);
            }

            $scope.addressList = [];
            //初始化地址监听
            $scope.$on('address.search',function(event){
                $scope.addressList = [];
                $scope.addressList = Address.addressList;
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
                $scope.product_oprice = $filter('formatNumber')(($scope.productList[0].uprice)*$scope.productList[0].pro_cnt,'#.000');
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
                if($scope.address_place1 == undefined){
                    var alertPopup = $ionicPopup.alert({
                        title:'请选择区域!',
                        okType:'button-balanced',okText:'确定'
                    });
                }else if($scope.address_place == undefined){
                    var alertPopup = $ionicPopup.alert({
                        title:'请选择自提点!',
                        okType:'button-balanced',okText:'确定'
                    });
                }else{
                    Address.address_add(address,userid,$scope.address_place);
                }
            }

            //添加地址监听
            $scope.$on('address.add',function(event){
                Address.address_search(userid);
                $scope.modal.hide();
            });

            //修改地址
            $scope._modify_address = function (addressList) {
                if($scope.address_place1 == undefined){
                    var alertPopup = $ionicPopup.alert({
                        title:'请选择区域!',
                        okType:'button-balanced',okText:'确定'
                    });
                }else if($scope.address_place == undefined){
                    var alertPopup = $ionicPopup.alert({
                        title:'请选择自提点!',
                        okType:'button-balanced',okText:'确定'
                    });
                }else{
                    Address.address_modify(addressList,userid,$scope.address_place);
                }
            }

            //修改地址监听
            $scope.$on('address.modify',function(event){
                Address.address_search(userid);
                $scope.modal2.hide();
            });

            //$scope.query_address = function () {
            //    $state.go('address');
            //}

            $scope.modify_address = function (addressList) {
                $scope.address_place1 = '邗江区';
                $scope.address_place = addressList[0].address;
                Address.address_search(userid);
                //跳转至新增地址页面
                $ionicModal.fromTemplateUrl('modify_address.html', {
                    scope: $scope,
                    animation: 'slide-in-up'
                }).then(function(modal) {
                    $scope.modal2 = modal;
                    $scope.modal2.show();
                });
            }

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


            $scope.address_place='选择自提点';
            //选择自提点
            $scope.choose = function (place) {
                $scope.address_place = place.title;
                $scope.modal3.hide();
            }

            var pay_way = '在线支付';
            //选择支付方式
            $scope.paymodel = [{"val":"在线支付","key":"在线支付"},{"val":"余额支付","key":"余额支付"}];
            $scope.payway = "在线支付";
            $scope.change = function(payway){
                $scope.payway = payway;
                pay_way = $scope.payway;
            }


            var order_type = {};
            //提交订单
            $scope.submit_order = function (productList,addressList) {
                if(pay_way == ''){
                    var alertPopup = $ionicPopup.alert({
                        title:'请选择支付方式!',
                        okType:'button-balanced',okText:'确定'
                    });
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
                    Order.submit_order(productList,addressList,userid,pay_way,order_type);
                }
            }

            //提交订单监听
            $scope.$on('order.submit',function(event){
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
                            title: "是否使用余额支付？",
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
                                    Pay.balance_pay(orderInfo, userid);
                                }
                            } else {
                                $state.go('all_order');
                            }
                        });
                    }
                }
            });

            //余额支付监听
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
            }

}]);

//查询所有订单
appControllers
    .controller('QueryOrderCtrl',
    [ '$scope', '$ionicLoading','Order','$stateParams','$ionicHistory','Ds','$state','$ionicPopup','Pay','Login',
        function($scope,$ionicLoading,Order,$stateParams,$ionicHistory,Ds,$state,$ionicPopup,Pay,Login){

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
            $scope.pay_order = function (order) {
                var myPopup = $ionicPopup.show({
                    template: '',
                    title: '选择支付方式',
                    subTitle: '',
                    scope: $scope,
                    buttons: [
                        { text: '在线支付',
                            type: 'button-balanced',
                            onTap: function() {
                                return false;
                            }},
                        {
                            text: '余额支付',
                            type: 'button-balanced',
                            onTap: function() {
                                    return true;
                            }
                        }
                    ]
                });
                myPopup.then(function(res) {
                        if(res){
                            //余额支付
                            var confirmPopup = $ionicPopup.confirm({
                                title: "是否使用余额支付？",
                                okType:'button-balanced',okText:'确定',
                                cancelType:'button-balanced',cancelText:'取消'
                            });
                            confirmPopup.then(function(res) {
                                if(res) {
                                    if(Ds.get("user").amount < order.totalmoney){
                                        var alertPopup = $ionicPopup.alert({
                                            title:'余额不足!',
                                            okType:'button-balanced',okText:'确定'
                                        });
                                        $state.go('all_order');
                                    }else {
                                        Pay.balance_pay(order, userid);
                                    }
                                } else {
                                    $state.go('all_order');
                                }
                            });
                        }else{
                            //在线支付
                            var confirmPopup = $ionicPopup.confirm({
                                title: '是否现在去支付？',
                                okType:'button-balanced',okText:'确定',
                                cancelType:'button-balanced',cancelText:'取消'
                            });
                            confirmPopup.then(function(res) {
                                if(res) {
                                    YFPay.alipay(function(){
                                            $state.go('state_order',{state:2})
                                        },
                                        function(){
                                            $state.go('all_order');
                                                 //order.totalmoney
                                        },[order.orderid,'一日三顿','一日三顿',0.01]);
                                } else {
                                    $state.go('all_order');
                                }
                            });
                        }
                });
            }

            //余额支付监听
            $scope.$on('pay.success', function (event) {
                if(Pay.state == 1){
                    Login.query(userid);
                    $state.go('state_order',{state:2});
                }
            });

            //取消订单
            $scope.cancel_order = function (order) {
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
            }

            $scope.$on('order.cancel', function (event) {
                Order.query_order(userid);
                $scope.orderList1 = Order.orderList1;
            })
        }]);

//查询类别订单
appControllers
    .controller('_QueryOrderCtrl',
    [ '$scope', '$ionicLoading','Order','$stateParams','$ionicHistory','Ds','$state','$ionicPopup','Pay',
        function($scope,$ionicLoading,Order,$stateParams,$ionicHistory,Ds,$state,$ionicPopup,Pay){
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
            $scope.pay_order = function (order) {
                var myPopup = $ionicPopup.show({
                    template: '',
                    title: '选择支付方式',
                    subTitle: '',
                    scope: $scope,
                    buttons: [
                        { text: '在线支付',
                            type: 'button-balanced',
                            onTap: function() {
                                return false;
                            }},
                        {
                            text: '余额支付',
                            type: 'button-balanced',
                            onTap: function() {
                                return true;
                            }
                        }
                    ]
                });
                myPopup.then(function(res) {
                    if(res){
                        //余额支付
                        if(confirm("是否使用余额支付？")){
                            if(Ds.get("user").amount < order.totalmoney){
                                //alert("余额不足");
                                var alertPopup = $ionicPopup.alert({
                                    title:'余额不足!'
                                });
                                $state.go('all_order');
                            }else {
                                Login.query(userid);
                                Pay.balance_pay(order, userid);
                            }
                        }else{
                            $state.go('state_order',{state:1});
                        }
                    }else{
                        //在线支付
                        //TODO: 修改支付金额  orderInfo.total
                        var confirmPopup = $ionicPopup.confirm({
                            title: '是否现在去支付？',
                            okType:'button-balanced',okText:'确定',
                            cancelType:'button-balanced',cancelText:'取消'
                        });
                        confirmPopup.then(function(res) {
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
                        });
                        }


                });
            }

            //余额支付监听
            $scope.$on('pay.success', function (event) {
                if(Pay.state == 1){
                    Login.query(userid);
                    $state.go('state_order',{state:2});
                }
            });

            $scope.cancel_order = function (order) {
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
            }
        }]);

//地址管理控制器
appControllers
    .controller('AddressCtrl',
    ['$scope','$ionicLoading','Order','$stateParams','$ionicHistory','Ds','$state',
        function (scope,$ionicLoading,Order,$stateParams,$ionicHistory,Ds,$state) {
            //$ionicLoading.show({template: '加载中...'});
            var userid = Ds.get("user").userid;

            $scope.address_back = function () {
                history.back();
            }
        }
    ])

