allCotrollers
    .controller('SideMenuCtrl',
    [ '$rootScope','$scope','$ionicModal','$state','Ds','Login','$timeout',
        function($rootScope,$scope,$ionicModal,$state,Ds,Login,$timeout) {
     
          $rootScope.$on('$stateChangeStart',
                         function(event, toState, toParams, fromState, fromParams) {
                         //console.log(event);
                         //event.stopPropagation();
                         //alert(toState.name);
                         if ((fromState.name == "app.main" || fromState.name == "app.setting") && (toState.name == "app.favorite" || toState.name == "app.address" || toState.name == "app.menu" || toState.name == "app.tickets")) {
                         //判断是否登录
                         var isLogin = Ds.has('userid');
                         if (!isLogin) {
                         //跳转至登陆页面
                         $ionicModal.fromTemplateUrl('login.html', {
                                                     scope: $scope,
                                                     animation: 'slide-in-up'
                                                     }).then(function (modal) {
                                                             $scope.loginModal = modal;
                                                             $scope.loginModal.show();
                                                             });
                         //阻止事件冒泡
                         event.preventDefault();
                         return false;
                         }
                         }
          
                         //if(toState.name == 'app.menu'){
                         //    if()
                         //}
                         //    console.log('首页强制清除搜索结果本页面的缓存');
                         //    console.log(toState);
                         //    console.log($templateCache);
                         //
                         //    $templateCache.remove(toState.templateUrl);
                         //    //toState.cache = false;
                         //}
                         }
                         );
          $scope.login_back = function(){
          $scope.loginModal.hide().then()
          {
          $state.go("app.main");
          };
          }

     
        $scope.qq_wx_Login = Ds.has('qq_wx_Login');
        if($scope.qq_wx_Login){
            $scope.qq_wx_name = Ds.get('qq_wx_Login').name;
            $scope.qq_wx_icon = Ds.get('qq_wx_Login').icon;
         }else{
         $scope.qq_wx_name = '未登录';
         $scope.qq_wx_icon = './img/logo_qq.png';
         }

            $scope.loginPage = function (){
                if (!$scope.qq_wx_Login) {
                    //跳转至登陆页面
                    $ionicModal.fromTemplateUrl('login.html', {
                        scope: $scope,
                        animation: 'slide-in-up'
                    }).then(function (modal) {
                        $scope.loginModal = modal;
                        $scope.loginModal.show();
                    });
                }
            }
     
     
     $scope.softLogin = function (softName){
     YFShare.auth(function(user){
                      //                         for(var k in user){
                      //                         alert(k+":"+user[k]);
                      //                         }
                      Ds.set('qq_wx_Login',user);
                      Ds.set('loginWay',softName);
                      Login.uniteLogin(user.uid,softName);
                      $scope.$on('login.success',function(){
                                 $scope.loginModal.remove();
                                 $scope.qq_wx_name = user.name;
                                 $scope.qq_wx_icon = user.icon;
                                 $state.go("app.main");
                                 });
                      $scope.$on('login.fail',function(event){
                                 //alert("登录失败,用户名或密码错误!");
                                 var alertPopup = $ionicPopup.alert({
                                                                    title:'登录失败,用户名或密码错误!',
                                                                    okType:'button-balanced'
                                                                    });
                                 $timeout(function() {
                                          alertPopup.close(); //close the popup after 1 seconds for some reason
                                          }, 1500);
                                 });
                      },function(error){alert(error);},[softName]);//qq登录
     //登录成功后返回openID，查询接口获取uid并保存到localStorage
     }
             $scope.share = function (){
                 YFShare.share(function(){alert('ok');},function(error){alert(error);},['title','content','http://blog.yfsoft.info','zheshi duan miaoshu']);//分享
             }

     $scope.$on('login.uniteLogout',function(){
         $scope.qq_wx_Login = false;
                $scope.qq_wx_name = '未登录';
                $scope.qq_wx_icon = './img/logo_qq.png';
                $state.go("app.main");
                });
     

        }]);