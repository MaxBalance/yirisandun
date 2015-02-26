appControllers
    .controller('PersonCtrl',
    [ '$scope', '$ionicLoading','Login','Ds','$ionicModal','Register','Password','Message','$state','Order','$ionicHistory','$timeout','$ionicPopup',
        function($scope,$ionicLoading,Login,Ds, $ionicModal,Register,Password,Message,$state,Order,$ionicHistory,$timeout,$ionicPopup) {

        //用户登录广播(成功)
        $scope.$on('person.login.success',function(event){
            if(Login.state == 1){
                $scope.modal.hide();
            }
            $scope.view_username = Ds.get("user").username;
            $scope.view_point = Ds.get("user").point;
            $scope.view_amount = Ds.get("user").amount;

            if(Ds.has("type")){
                $state.go('tab.cart');
            }
        });

        //用户登录广播(失败)
        $scope.$on('person.login.fail',function(event){
            //alert("登录失败,用户名或密码错误!");
            var alertPopup = $ionicPopup.alert({
                title:'登录失败,用户名或密码错误!',
                okType:'button-balanced'
            });

            $timeout(function() {
                alertPopup.close(); //close the popup after 1 seconds for some reason
            }, 1500);
        });


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
            $scope.view_username = Ds.get("user").username;
            $scope.view_point = Ds.get("user").point;
            $scope.view_amount = Ds.get("user").amount;

            var userid = Ds.get("user").userid;
        }

        if(Ds.has("user")){
            //个人中心显示用户信息
            $scope.view_username = Ds.get("user").username;
            $scope.view_point = Ds.get("user").point;
            $scope.view_amount = Ds.get("user").amount;
        }

        //登录
        $scope.login = function(person){
            Login.login(person);
        };

        $scope.login_back = function(){
            $scope.modal.hide().then()
            {
                location.href="#/tab/home";
            };
        }

        //登出
        $scope.logout = function () {
            Ds.clear();
            location.href="#/tab/home";
        };

        //用户注册广播(成功)
        $scope.$on('person.register.success',function(event){
            if (Register.state == 1) {
                $scope.modal2.hide().then()
                {
                    $scope.modal.hide();
                };
            }
            $scope.view_username = Ds.get("user").username;
            $scope.view_point = Ds.get("user").point;
            $scope.view_amount = Ds.get("user").amount;
        });

        //用户注册广播(失败)
        $scope.$on('person.register.fail',function(event){
            //alert("注册失败，请按规格填写用户名与密码!");
            var alertPopup = $ionicPopup.alert({
                title:'注册失败，请按规格填写用户名与密码!',
                okType:'button-balanced'
            });

            $timeout(function() {
                alertPopup.close(); //close the popup after 1 seconds for some reason
            }, 1500);
        });

     
        //跳转至注册页面
        $scope.register = function () {
            $ionicModal.fromTemplateUrl('register.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function(modal2) {
                $scope.modal2 = modal2;
                $scope.modal2.show();
            });
        };
            

        //注册用户
        $scope._register = function (person_r) {
            Register._register(person_r);
        };

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
            var alertPopup = $ionicPopup.alert({
                title:'暂未开放!',
                okType:'button-balanced'
            });
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
    }])
;