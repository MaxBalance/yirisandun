/**
 * Created by Administrator on 2015-03-07.
 */
allCotrollers
    .controller('FoodsCtrl',function($rootScope,$scope,$ionicModal,$ionicPopup,FoodsList,FoodInfo,Ds){
    //初始化
    var lon = Ds.get('Longitude');
    var lat = Ds.get('Latitude');
//    var uid = Ds.get('userid');
    var uid = 114;

    var currentStart=0;
    $scope.foodsListC=[];
    $scope.addFoodsListC=function(){
        for(var i=currentStart;i<currentStart+20;i++){
            $scope.foodsListC.push(FoodsList.get(currentStart));
        }
        currentStart+=20;
        $scope.$broadcast('scroll.infiniteScrollComplete');
    }


    var init = function () {
        FoodsList.init(uid,lon,lat);
    }

    init(uid);
    $scope.$on('foods.load',function(){
        $scope.foodsList = [];
        $scope.foodsList = FoodsList.content;
    });

    //显示详情页
    $scope.showFoodDetails = function(fid){
        //获取菜品详情
        FoodInfo.getFoodInfo(fid,uid,lon,lat);
        $scope.$on('foodInfo.load',function(){
        $scope.foodInfo=[];
        $scope.foodInfo=FoodInfo.content;
        });
        $ionicModal.fromTemplateUrl('foodDetails.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
            $scope.modal.show();
        })
        //需要读取用户收藏列表，判断该菜品是否已经收藏
        FoodInfo.ifCollect(uid,lon,lat,fid);
        $scope.$on('foodInfo.ifCol',function($event,ret){
            if(ret){
                $scope.junheart = 'button button-clear button-dark ion-ios-heart';
            }else {
                $scope.junheart = 'button button-clear button-dark ion-ios-heart-outline';
            }
        })
    }


    //页面返回
    $scope.view_back = function(){
        $scope.modal.hide().then()
        {
            location.href="#/app/foods";
        };
    }

    //收藏菜品
    $scope.addCollect = function(fid){
        FoodInfo.addCollect(uid,fid);
        $scope.$on('foodInfo.addCol',function($event,msg){
            if(msg==1){
                $scope.junheart = 'button button-clear button-dark ion-ios-heart'
                /**
                var alertPopup = $ionicPopup.alert({
                    title:'收藏成功!',
                    okType:'button-balanced'
                });**/
            }else{
                $scope.junheart = 'button button-clear button-dark ion-ios-heart-outline'
                /**
                var alertPopup = $ionicPopup.alert({
                    title:'收藏取消!',
                    okType:'button-balanced'
                });**/
            }
        })

    }

    //选择菜品数量
    //$scope.addCount=function(uid,fid){
    //    $scope.data = {foodCount:1};
    //    var myPopup = $ionicPopup.show({
    //        template: '<input type="text" style="text-align: center " ng-model="data.foodCount" >',
    //        title: '请选择菜品数量',
    //        subTitle: '请输入0-99的数字',
    //        scope: $scope,
    //        buttons: [
    //            { text: '取消' },
    //            {
    //                text: '<b>确认</b>',
    //                type: 'button-positive',
    //                onTap: function() {
    //                   //alert($scope.data.foodCount);
    //                    $scope.addMenuList(uid,fid);
    //                }
    //            }
    //        ]
    //    });
    //}

    //加入菜单
    $scope.addMenuList = function(fid){
        FoodInfo.addMenuList(uid,fid);
        $scope.$on('foodInfo.addMenuList',function($event,msg){
            alert('加入菜单成功!');
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

})

//我的收藏
.controller('FavoriteCtrl',function($rootScope,$scope,$ionicModal,$ionicPopup,MyCollects,Ds,FoodInfo){
        var lon = Ds.get('Longitude');
        var lat = Ds.get('Latitude');
        var userid = Ds.get('userid');

        var init = function () {
            MyCollects.getCollects(userid,33.333,33.333);
        }

        init();
        $scope.$on('myCollects.load', function () {
            $scope.collectsList = [];
            $scope.collectsList = MyCollects.content;
        })

        $scope.foodDetail = function (food){
            //获取菜品详情
            FoodInfo.getFoodInfo(food.fid,userid,33.3333,33.3333);
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
            init();
        }

        //$scope.remove = function(menu) {
        //    Menu.remove(menu,userid);
        //}

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

        //加入菜单
        $scope.addMenuList = function(fid){
            FoodInfo.addMenuList(userid,fid);
            $scope.$on('foodInfo.addMenuList',function($event,msg){
                alert('加入菜单成功!');
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

        //$scope.$on('menu.del',function($event,code){
        //    if(code ==0) {
        //        Menu.myMenuCnt(userid);
        //        var alertPopup = $ionicPopup.alert({
        //            title:'删除成功!',
        //            okType:'button-balanced'
        //        });
        //    }
        //});
    })