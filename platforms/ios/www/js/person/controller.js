appControllers
    .controller('PersonCtrl',
    [ '$scope', '$ionicLoading','Login','Ds','$ionicModal','Register','Password','Message','$state','Order','$ionicHistory','$timeout','$ionicPopup','$interval','$cordovaToast',
        function($scope,$ionicLoading,Login,Ds, $ionicModal,Register,Password,Message,$state,Order,$ionicHistory,$timeout,$ionicPopup,$interval,$cordovaToast) {

        //用户登录广播(成功)
        $scope.$on('person.login.success',function(event){
            if(Login.state == 1){
                $scope.modal.hide();
            }
            $scope.user = Ds.get("user");

            if(Ds.has("type")){
                $state.go('tab.cart');
            }else{
                $state.go('tab.home');
            }
            Login.query(Ds.get("user").userid);
        });

        $scope.qqLogin = function () {
            YFShare.auth(function(user){
                Login.qqLogin(user.uid);
            },function(error){alert('登陆失败');},['qq']);//qq登录
        }

        //判断是否登录
        var isLogin = Ds.has('user');
        if(!isLogin){
            //跳转至登陆页面
            $ionicModal.fromTemplateUrl('login.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function(modal) {
                $scope.modal = modal;
                $scope.modal.show();
            });
        }else{
            //个人中心显示用户信息
            Login.query(Ds.get("user").userid);
        }

        //$scope.$on('person.query.success', function () {
        //    $scope.user = Ds.get("user");
        //})

        //登录
        $scope.login = function(person){
            Login.login(person.username,person.password);
        };

        $scope.login_back = function(){
            $scope.modal.remove().then()
            {
                location.href="#/tab/home";
            };
        }

        //登出
        $scope.logout = function () {
         //Ds.clear();
         //$state.go('tab.home');

        YFShare.logout(function () {
            Ds.clear();
            location.href="#/tab/home";
        },['qq']);
        };

        //用户注册广播(成功)
        $scope.$on('person.register.success',function(event){
            if (Register.state == 1) {
                $scope.modal2.hide().then()
                {
                    $scope.modal.hide();
                };
            }
            Login.query(Ds.get("user").userid);
        });

        //用户注册广播(失败)
        $scope.$on('person.register.fail',function(event){
            $cordovaToast.showShortCenter('注册失败,用户名已存在');
        });

        //注册手机号已存在
        $scope.$on('getCode.fail', function (event) {
            $cordovaToast.showShortCenter('该手机号已注册过');
        })
     
        //跳转至注册页面
        $scope.register = function () {
            $ionicModal.fromTemplateUrl('register.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function(modal2) {
                $scope.turnNum = 10;
                $scope.modal2 = modal2;
                $scope.modal2.show();
            });
        };

        //注册用户
        $scope._register = function (person_r) {
            if(person_r.password_one != person_r.password_two){
                $cordovaToast.showShortCenter('两次输入密码不一致!');
                return false;
            }
            var reg = /^[_0-9a-zA-Z]{0,20}$/;
            if (!reg.test(person_r.username) || person_r.username.length < 5 || person_r.username.length >=20 || person_r.username=='' ){
                $cordovaToast.showShortCenter('请输入(5-20位,由a-z\0-9\_)用户名');
                return false;
            }

            if (!reg.test(person_r.password_one) || person_r.password_one.length < 6 || person_r.password_one =='')
            {
                $cordovaToast.showShortCenter('请输入(6-20位,由a-z\0-9\_)密码');
                return false;
            }
            if (!/^1\d{10}$/.test(person_r.phone)) {
                $cordovaToast.showShortCenter('请填写正确的手机号!');
                return false;
            }
            if(Ds.has('LoginCode') && person_r.code != Ds.get('LoginCode')){
                $cordovaToast.showShortCenter('验证码错误!');
                return false;
            }
            Register._register(person_r);
        };

        //用户登录广播(失败)
        $scope.$on('person.login.fail',function(event){
            $cordovaToast.showShortCenter('登录失败,用户名或密码错误!');
        });

        $scope.register_back = function(){
            $scope.modal2.hide();
        }

        //修改密码广播
        $scope.$on('person.password',function(event){
            if(Password.state == 1) {
                $scope.modal3.hide();
            }
        });

        //跳转至修改密码页面
        $scope.password = function(){
            $ionicModal.fromTemplateUrl('password.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function(modal3) {
                $scope.modal3 = modal3;
                $scope.modal3.show();
            });
        };

        //修改密码
        $scope._password = function (person_w) {
            Password._password(person_w);
        };

        $scope.password_back = function(){
            $scope.modal3.hide();
        };

        //跳转至消息心中
        $scope.message = function(){
            $ionicModal.fromTemplateUrl('message.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function(modal4) {
                $scope.modal4 = modal4;
                $scope.modal4.show();
            });
            Message.message(Ds.get("user").userid);
        }

        //消息中心广播
        $scope.$on('message.init', function (event) {
            $scope.messageList = Message.messageList;
        });

        $scope.message_back = function(){
            $scope.modal4.hide();
        }

        //todo..我的消费卷
        $scope.tickets = function(){
            //$state.go('tab.product-detail',{'productId':3});
            $cordovaToast.showShortCenter('暂未开放!');
            //cordova.plugins.Web.webAlert();
        }

        //跳转至所有订单页面
        $scope.query_order = function () {
            $state.go('all_order');
        }

        //跳转至订单页面
        $scope.query_order_state = function (state) {
            $state.go('state_order',{state:state});
        }

        $scope.showCode = true;
        //$scope.person_r = {};
        //$scope.person_r.phone = '';
        $scope.countNum = 60;
        var num = '';
        $scope.getCount = function (person_r) {
            try{
                if (person_r.phone == undefined || !/^1\d{10}$/.test(person_r.phone)) {
                    $cordovaToast.showShortCenter('请填写正确的手机号!');
                    return false;
                }
            }catch (e){
                $cordovaToast.showShortCenter('请填写正确的手机号!');
                return false;
            }
     
            Register.getCode(person_r);
        }

        $scope.$on('getCode.success', function () {
                   $scope.showCode = false;
                   (function(){
                    num = $interval(turns,1000,61);
                    })();
        })

        function turns() {
            if($scope.countNum  == 0){
                $scope.showCode = true;
            }
            $scope.countNum --;
        }

        //var code = $scope.code = {};
        //$scope.countNum =60;
        //$scope.counterStr = '60S'
        //var num = '';
        //$scope.getCount = function (counterStr ) {
        //    counterStr = '60S';
        //    $scope.showCode = false;
        //    //(function(){
        //    for(var i=0;i<10;i++){
        //        var timer = i*1000;
        //        (function(t){
        //            $timeout(function(){
        //                $scope.turnNum --;
        //                $scope.counterStr = $scope.turnNum+'S'
        //                if($scope.turnNum  == 0){
        //                    $scope.showCode = true;
        //                    clearInterval(num);
        //                }
        //            },t);
        //        })(timer);
        //    }
        //}
    }])
;