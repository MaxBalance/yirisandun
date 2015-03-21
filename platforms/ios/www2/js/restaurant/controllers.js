allCotrollers
    .controller('ResCtrl',function($rootScope,$scope,Restaurant,$state,Ds){
        //初始化首页
        var init = function () {
            Restaurant.init(Ds.get('Longitude'),Ds.get('Latitude'));
        }

        init();
        $scope.$on('restaurant.load',function(){
            $scope.restaurantList = [];
            $scope.restaurantList = Restaurant.content;
        })

        //酒店详情
        $scope.details = function (restaurant) {
            $state.go('app.details',{restaurantID:restaurant.id});
        }

        //搜索
        $scope.search = function () {
            $state.go('search');
        }
    })

    .controller('DetailCtrl',function($rootScope,$scope,$stateParams,RestaurantDetails,FoodDetails,$ionicSlideBoxDelegate,FoodInfo,Ds,$ionicModal){
        var lon = Ds.get('Longitude');
        var lat = Ds.get('Latitude');
        //var userid = Ds.get('userid');
        var userid = 114;

        //查询饭店详情
        RestaurantDetails.restaurantDetail($stateParams.restaurantID);

        $scope.$on('restaurantDetail.load', function () {
            $scope.restaurant_Detail = [];
            $scope.restaurant_Detail = RestaurantDetails.content;
        })

        //查询菜品详情
        FoodDetails.foodDetail($stateParams.restaurantID);

        $scope.foodList = [];
        $scope.$on('foodDetail.load', function (event) {
            var data = FoodDetails.content.foods;
            var amount = FoodDetails.content.total;
            var cnt = Math.ceil(amount/6);
            var foodList = [];
            for(var i=0,j=0; i<amount,j<cnt;i=i+6,j++){
                foodList[j]= {'food1':data[i],'food2':data[i+1],'food3':data[i+2],'food4':data[i+3],'food5':data[i+4],'food6':data[i+5]};
            }
            $scope.foodList = foodList;
            $ionicSlideBoxDelegate.update();
        })

        $scope.foodDetail = function (food){
            //获取菜品详情
            FoodInfo.getFoodInfo(food.id,114,33.3333,33.3333);
            $scope.$on('foodInfo.load',function(){
                $scope.foodInfo=[];
                $scope.foodInfo=FoodInfo.content;
            });
            $ionicModal.fromTemplateUrl('foodDetails.html', {
                scope: $scope,
                animation: 'slide-in-left'
            }).then(function(modal) {
                $scope.foodDetailModal = modal;
                $scope.foodDetailModal.show();
            })
            //需要读取用户收藏列表，判断该菜品是否已经收藏
            FoodInfo.ifCollect(userid,33.3333,33.3333,food.fid);
            $scope.$on('foodInfo.ifCol',function($event,ret){
                if(ret){
                    $scope.junheart = 'button button-clear button-dark ion-ios-heart';
                }else {
                    $scope.junheart = 'button button-clear button-dark ion-ios-heart-outline';
                }
            })
        }

        $scope.foodDetail_back = function (){
            $scope.foodDetailModal.hide();
        }

        $scope.remove = function(menu) {
            Menu.remove(menu,userid);
        }

        //加入菜单
        $scope.addMenuList = function(fid){
            FoodInfo.addMenuList(userid,fid);
            $scope.$on('foodInfo.addMenuList',function($event,msg){
                alert('加入菜单成功');
                //    if(msg==0){
                //         $ionicPopup.alert({
                //            title:'加入菜单成功!数量：'+$scope.data.foodCount,
                //            okType:'button-balanced'
                //        });
                //    }else if(msg==-3){
                //        $ionicPopup.alert({
                //            title:'抱歉，菜品库存不足。',
                //            okType:'button-balanced'
                //        });
                //    }else if(msg==-4){
                //        $ionicPopup.alert({
                //            title:'菜品已经加入菜单。',
                //            okType:'button-balanced'
                //        });
                //    }
            });
        }

        //收藏菜品
        $scope.addCollect=function(fid){
            FoodInfo.addCollect(userid,fid);
            $scope.$on('foodInfo.addCol',function($event,msg){
                if(msg==1){
                    $scope.junheart = 'button button-clear button-dark ion-ios-heart'
                }else{
                    $scope.junheart = 'button button-clear button-dark ion-ios-heart-outline'
                }
            })

        }
    })