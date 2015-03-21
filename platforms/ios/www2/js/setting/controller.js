allCotrollers
    .controller('SettingCtrl',
    [ '$rootScope','$scope','$state','$ionicLoading','$ionicModal','Setting','$ionicPopup','$templateCache','Ds','Login',
        function($rootScope,$scope,$state,$ionicLoading,$ionicModal,Setting,$ionicPopup,$templateCache,Ds,Login) {

            $scope.isLogin = Ds.has('userid');

            //跳转至意见反馈 By Jack
            $scope.opinion = function(){
                $ionicModal.fromTemplateUrl('opinion.html', {
                    scope: $scope,
                    animation: 'slide-in-up'
                }).then(function(modal) {
                    $scope.messageModal = modal;
                    $scope.messageModal.show();
                });
            }
            $scope.opinion_back = function(){
                $scope.messageModal.remove();
            }

            //意见反馈
            $scope.postOpinion = function(opinionInfo){
                if(opinionInfo == undefined){
                    //alert("请填写正确的信息");
                    var alertPopup = $ionicPopup.alert({
                        title:'请填写正确的信息!',
                        okType:'button-balanced'
                    });
                    return false;
                }
                if(!opinionInfo.content){
                    //alert("还没写您宝贵的意见!");
                    var alertPopup = $ionicPopup.alert({
                        title:'还没写您宝贵的意见!',
                        okType:'button-balanced'
                    });
                    return false;
                }
                var re = /[^u4e00-u9fa5]/;
                if(re.test(opinionInfo.contact)){
                    $ionicPopup.alert({
                        title:'联系方式不能为中文!',
                        okType:'button-balanced'
                    });
                    return false;
                }
                if(isNaN(opinionInfo.contact)){
                    if (!/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test(opinionInfo.contact)) {
                        var alertPopup = $ionicPopup.alert({
                            title:'请填写正确的邮箱地址!',
                            okType:'button-balanced'
                        });
                        return false;
                    }
                }else{
                    if (!/^1\d{10}$/.test(opinionInfo.contact)) {
                        var alertPopup = $ionicPopup.alert({
                            title:'请填写正确的手机号!',
                            okType:'button-balanced'
                        });
                        return false;
                    }
                }
                Setting.opinion(opinionInfo);
            }
            $scope.$on('setting.opinion',function($event,code){
                if($scope.messageModal){
                    $scope.messageModal.remove();
                }
                //$ionicLoading.hide();
                if(code ==0) {
                    $scope.opinionInfo = {};
                    var alertPopup = $ionicPopup.alert({
                        title:'你的意见已发送成功，我们将竭诚为您服务!',
                        okType:'button-balanced'
                    });
                }
            });


            //跳转至关于我们 By Jack
            $scope.aboutus = function(){
                $ionicModal.fromTemplateUrl('aboutus.html', {
                    scope: $scope,
                    animation: 'slide-in-up'
                }).then(function(modal) {
                    $scope.modal = modal;
                    $scope.modal.show();
                });
            }

            $scope.aboutus_back = function(){
                $scope.modal.hide().then()
     
                {
                    location.href="#/app/setting";
                };
            }
            Setting.version(1);
            $scope.$on('setting.version',function(){
                $scope.version = Setting.content.rows[0].version;
            });
     
     $scope.logout = function (){
     YFShare.logout(function(){Ds.remove('userid');},[Ds.get('loginWay')]);//登出
     Login.uniteLogout();
//         Ds.set('guide',true);
     $state.go("app.main");
     }

        }]);