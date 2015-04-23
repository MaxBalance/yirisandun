appControllers
.controller('CartCtrl',[ '$rootScope','$scope', '$ionicLoading','$ionicModal','$state','Cart','Ds','Login','$ionicHistory',
    function($rootScope,$scope,$ionicLoading,$ionicModal,$state,Cart,Ds,Login,$ionicHistory){

        var init = function(){
            var isLogin = Ds.has('user');
            if(!isLogin){
                Ds.set("type","tab.cart");
                $state.go('tab.person');
                return;
            }
            $scope.hideOrder = true;
            $ionicLoading.show({template: '加载中...'});
            $scope.amount = 0.0;

            $scope.goods = [];

            Cart.query(Ds.get('user').userid);

            $scope.enableDeal = true;

            total = 0;
            $scope.allChecked = false;
            $scope.$emit('ChangeCartcnt',0);
        };

        init();
        var good_cnts = '';
        $scope.$on('cart.init',function(event){
            $scope.goods = Cart.goods;
            $ionicLoading.hide();
            $scope.hideOrder = $scope.goods.length<1;
            //angular.forEach($scope.goods, function (data) {
            //    good_cnts += data.pro_cnt;
            //})
            //Ds.set('goods',$scope.goods.length);
        });

        var total = 0;
        $scope.allChecked = false;
        $scope.toggleAll = function () {
            var tempAmount = 0;
            if($scope.allChecked){
                total = 0;
                angular.forEach($scope.goods, function (data) {
                    if(data.limited_flag == 1){
                        tempAmount = parseFloat((data.aprice*data.pro_cnt).toFixed(2));
                    }else{
                        tempAmount = parseFloat((data.uprice*data.pro_cnt).toFixed(2));
                    }
                    total += tempAmount;
                    data.checked = true;
                    $scope.enableDeal = false;

                })

            }else{
                total = 0;
                angular.forEach($scope.goods, function (data) {
                    data.checked = false;
                })
                $scope.enableDeal = true;
            }
            $scope.amount = total.toFixed(2);
        }

        $scope.sub = function(good){
            if(good.checked || $scope.allChecked) return;
            var cnt = good.pro_cnt;
            if(cnt==1){
            //    //删除
            //    var i = $scope.goods.indexOf(good);
            //    $scope.goods.splice(i,1);
                return;
            }
            good.pro_cnt = cnt - 1;
        };

        function asynCart(){
            //console.log($scope.goods.length);
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
            if(good.checked || $scope.allChecked) return;
            var cnt = good.pro_cnt;
            good.pro_cnt = cnt + 1;
        };

        var flag = false;
        $scope.toggle = function(good){
            if(good.limited_flag == 1){
                tempAmount = parseFloat((good.aprice*good.pro_cnt).toFixed(2));
            }else{
                tempAmount = parseFloat((good.uprice*good.pro_cnt).toFixed(2));
            }
            tempAmount = parseFloat(parseFloat(tempAmount.toFixed(2)));

            if(good.checked){
                total += tempAmount;
            }else{
                total -= tempAmount;
            }
            //fix ： 可能会出现负数的情况
            if(total<=0){
                total = 0;
                $scope.enableDeal = true;
            }else{
                $scope.enableDeal = false;
            }

            $scope.amount = total.toFixed(2);


            //angular.forEach($scope.goods, function (data,index) {
            //
            //    if(data.checked == undefined || data.checked == false){
            //        flag = false;
            //        //throw new Error();
            //    }else{
            //        flag = true;
            //    }
            //})
            //$scope.allChecked = flag;

            for(var i= 0;i<$scope.goods.length;i++){
                if($scope.goods[i].checked == undefined || $scope.goods[i].checked == false){
                    flag = false;
                    break;
                }else{
                    flag = true;
                }
            }
            $scope.allChecked = flag;
        };


        $scope.deal = function($event){

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

        //删除购物车
        $scope.remove = function(index){
            var good = $scope.goods[index];
            if(good.checked) return;
            try{
                $scope.goods.splice(index,1);
                $scope.$emit('ChangeCartcnt',cnt);
                cnt += 1;
            }catch(e){
                console.log(e);
            }
        };

        var cnt = 1;
        $scope.$on('$stateChangeSuccess',
            function($event, toState, toParams, fromState, fromParams){

                //console.log(toState);
                var isLogin = Ds.has('user');
                if(toState.name=='tab.cart' || toState.name=='product-detail-cart'){
                    cnt = 1;
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
                if(fromState.name=='tab.cart' || fromState.name=='product-detail-cart'){
                    //需要在此处进行购物车的数据同步
                    if(isLogin)
                        asynCart();
                }
            }
        );



        $scope.productCart_back = function () {
            history.back();
            //$ionicHistory.goBack();
        }
    }]);

