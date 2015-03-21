allCotrollers
.controller('MainCtrl', ['$rootScope','$scope','$ionicSideMenuDelegate','$ionicModal','$timeout','Main','$state','Ds','Login',
        function ($rootScope,$scope,$ionicSideMenuDelegate,$ionicModal,$timeout,Main,$state,Ds,Login) {


        //初始化首页
        var init = function () {
            //保存GPS
            var lon = {};
            var lat = {};
            if(Ds.has('Longitude') && Ds.get('Latitude')){
                lon = Ds.get('Longitude');
                lat = Ds.get('Latitude');
            }else{
                Ds.set('Longitude','33')
                Ds.set('Latitude','33')
                lon = Ds.get('Longitude')
                lat = Ds.get('Latitude');
            }
            Main.init(lon,lat);
        }

        init();

        $scope.toggleLeft = function () {
            $ionicSideMenuDelegate.toggleLeft();
        }

        $scope.$on('main.load',function(){
            //首页对象
            $scope.main_data = Main.content;

            //GPS定位
            //navigator.geolocation.getCurrentPosition(onSuccess, onError);
        })

        //附近的餐厅
        $scope.restaurants = function(){
            $state.go('app.restaurant');
        };

        $scope.foods=function(){
          $state.go('app.foods');
        };

        //酒店详情
        $scope.details = function (main_data) {
            $state.go('app.details',{restaurantID:main_data.id});
        }

        //GPS定位成功
        var onSuccess = function(position) {
            //alert('Latitude: '          + position.coords.latitude          + '\n' +
            //'Longitude: '         + position.coords.longitude         + '\n' +
            //'Altitude: '          + position.coords.altitude          + '\n' +
            //'Accuracy: '          + position.coords.accuracy          + '\n' +
            //'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
            //'Heading: '           + position.coords.heading           + '\n' +
            //'Speed: '             + position.coords.speed             + '\n' +
            //'Timestamp: '         + position.timestamp                + '\n');
            Ds.set('Latitude',position.coords.latitude);
            Ds.set('Longitude',position.coords.longitude);
        };

        //GPS定位失败
        function onError(error) {
            Ds.set('Latitude','33');
            Ds.set('Longitude','33');
            alert('code: '    + error.code    + '\n' +
            'message: ' + error.message + '\n');
        }

        //搜索
        $scope.search = function () {
            $state.go('search');
        }

        //我的消息
        $scope.message = function () {
            var uid = {};
            if(Ds.has('userid')){
                uid = Ds.get('userid');
            }else{
                //跳转至登陆页面
                //$ionicModal.fromTemplateUrl('login.html', {
                //    scope: $scope,
                //    animation: 'slide-in-up'
                //}).then(function (modal) {
                //    $scope.loginModal = modal;
                //    $scope.loginModal.show();
                //});
                Ds.set('userid',36);
            }
            $state.go('app.message',{'uid':uid});
        }


    }]);