appControllers
.controller('CartCtrl',[ '$rootScope','$scope', '$ionicLoading','$ionicModal','$state','Cart','Ds',
    function($rootScope,$scope,$ionicLoading,$ionicModal,$state,Cart,Ds){


        var init = function(){
            var isLogin = Ds.has('user');
            if(!isLogin){
                Ds.set("type","tab.cart");
                //location.href="#/tab/person";
                $state.go('tab.person');
                return;
            }
            $scope.hideOrder = true;
            $ionicLoading.show({template: '加载中...'});
            $scope.amount = 0.0;

            $scope.goods = [];

            Cart.query(Ds.get('user').userid);

            $scope.enableDeal = true;
        };

        init();
        $scope.$on('cart.init',function(event){
            $scope.goods = Cart.goods;
            $ionicLoading.hide();
            $scope.hideOrder = $scope.goods.length<1;
        });


        $scope.sub = function(good){
            if(good.checked) return;
            var cnt = good.pro_cnt;
            if(cnt==1){
            //    //删除
            //
            //    var i = $scope.goods.indexOf(good);
            //    $scope.goods.splice(i,1);
            //
            //
                return;
            }
            good.pro_cnt = cnt - 1;
            //asynCart();
        };

        function asynCart(){

            console.log($scope.goods.length);
            var len = $scope.goods.length;
            var shopid = '';
            var shopnum = '';
            if(len==0){
                Cart.clear(Ds.get('user').userid);
                return;
            }
            for(var i = 0 ; i<len;i++){
                var g = $scope.goods[i];
                shopid += g.id;
                shopnum += g.pro_cnt;
                if(i < len - 1)
                {
                    shopid += ',';
                    shopnum += ',';
                }
            }
            Cart.modify(shopid,shopnum,Ds.get('user').userid);

        }

        $scope.plus = function(good){
            if(good.checked) return;
            var cnt = good.pro_cnt;
            good.pro_cnt = cnt + 1;
            //asynCart();
        };

        $scope.remove = function(index){
            var good = $scope.goods[index];
            if(good.checked) return;
            try{
                $scope.goods.splice(index,1);
            }catch(e){
                console.log(e);
            }
        };



        $scope.toggle = function(good){
            var tempAmount = parseFloat(good.uprice*good.pro_cnt);
            tempAmount = parseFloat(tempAmount.toFixed(2));
            var amount = parseFloat(parseFloat($scope.amount).toFixed(2));
            if(good.checked){
                amount += tempAmount;
            }else{
                amount -= tempAmount;
            }
            //fix ： 可能会出现负数的情况
            if(amount<=0){
                amount = 0;
                $scope.enableDeal = true;
            }else{
                $scope.enableDeal = false;
            }

            $scope.amount = amount.toFixed(2);



        };

        $scope.deal = function($event){

            //alert();
            //1.将需要生成订单的物品列表存放到DS中
            //将需要提交的生成单独的列表
            var orderList = [];
            for(var i = 0;i<$scope.goods.length;i++){
                var order = $scope.goods[i];
                if(order.checked){
                    orderList.push(order);
                }
            }

            var order = {amount:$scope.amount,list:orderList};
            Ds.set('cart.order',order);
            $state.go('cart_order');
        };

        $scope.pay = function(){
            cordova.plugins.Pay.alipay(['2014123023432060909','testsubject1','testbody','0.01']);
        };

        $rootScope.$on('$stateChangeSuccess',
            function($event, toState, toParams, fromState, fromParams){

                //console.log(toState);
                var isLogin = Ds.has('user');
                if(toState.name=='tab.cart'){
                    if(!isLogin){
                        Ds.set("type","tab.cart");
                        //location.href="#/tab/person";

                        $state.go('tab.person');
                        //$event.stopPropagation();
                        //return false;
                    }else{
                        init();
                    }

                }
                if(fromState.name=='tab.cart'){
                    //需要在此处进行购物车的数据同步
                    //console.log('购物车的数据同步');
                    if(isLogin)
                        asynCart();
                }
            }
        );

    }]);

