appControllers
.controller('HomeCtrl',
    [ '$rootScope','$cacheFactory','$templateCache','$scope', '$ionicLoading','$ionicModal','$state','$interval','Index','Ds','$ionicPopup',
        function($rootScope,$cacheFactory,$templateCache,$scope,$ionicLoading,$ionicModal,$state,$interval,Index,Ds,$ionicPopup){
            //TODO fix:进入首页需要将搜索栏清空
            //首页会被缓存，所以需要通过控制器之间进行通信才能实现该功能
            $scope.search = {content:''};
            $scope.slider = [];
            //监听ready 事件
            $scope.$on('index.ready',function($event){
                $scope.slider = Index.data.slider;
                $scope.page1 = $scope.slider[0];
                $scope.page2 = $scope.slider[1];
                $scope.page3 = $scope.slider[2];
                $scope.limit = Index.data.limit;
                $scope.overdate = new Date($scope.limit.overdate.time);
                $scope.overdateStr = '00:00:00';

                $scope.star = Index.data.star;
                $scope.line3_1 = Index.data.line3[0];
                $scope.line3_2 = Index.data.line3[1];
                $scope.line3_3 = Index.data.line3[2];
                $scope.line4_1 = Index.data.line4[0];
                $scope.line4_2 = Index.data.line4[1];
                $scope.line4_3 = Index.data.line4[2];
                //开启倒计时
                try{
                    countdown.start();
                }catch(e){

                }
            });
            Index.get();

            function checkTime(i)
            {
                if (i < 10) {
                    i = "0" + i;
                }
                return i;
            }
            var countdown = $interval(function() {
                var now = new Date();
                var delta =  $scope.overdate - now;
                var dd = parseInt(delta / 1000 / 60 / 60 / 24, 10);//计算剩余的天数
                var hh = parseInt(delta / 1000 / 60 / 60 % 24, 10);//计算剩余的小时数
                var mm = parseInt(delta / 1000 / 60 % 60, 10);//计算剩余的分钟数
                var ss = parseInt(delta / 1000 % 60, 10);//计算剩余的秒数
                hh += dd*24;
                hh = checkTime(hh);
                mm = checkTime(mm);
                ss = checkTime(ss);
                $scope.overdateStr = hh+':'+mm+':'+ss;
            }, 1000);

            $scope.hideModal = function(modal){
                modal.remove();
            }


            //日顿客服
            $scope.showOpinion = function(){
                $ionicModal.fromTemplateUrl('opinion.html', {
                    scope: $scope,
                    animation: 'slide-in-up'
                }).then(function(modal) {
                    $scope.opinionModal = modal;
                    modal.show();
                });
            }

            $scope.showBook = function(){
                $ionicModal.fromTemplateUrl('book.html', {
                    scope: $scope,
                    animation: 'slide-in-up'
                }).then(function(modal) {
                    $scope.bookModal = modal;
                    modal.show();
                });
            }

            $scope.showBrand = function(){
                $ionicModal.fromTemplateUrl('brand.html', {
                    scope: $scope,
                    animation: 'slide-in-up'
                }).then(function(modal) {
                    $scope.brandModal = modal;
                    modal.show();
                    Index.getBrand();
                });
            }
            $scope.$on('brand.ready',function($event){
                $scope.brandList = Index.brand;
            });

            $scope.$on('opinion.posted',function($event,code){
                if($scope.opinionModal){
                    $scope.opinionModal.remove();
                }
                if(code ==0){
                    //alert('谢谢');
                    var alertPopup = $ionicPopup.alert({
                        title:'谢谢!',
                        okType:'button-balanced'
                    });
                }

            });

            $scope.$on('book.posted',function($event,code){
                if($scope.bookModal){
                    $scope.bookModal.remove();
                }
                //$ionicLoading.hide();
                if(code ==0) {
                    //alert('预定成功!');
                    var alertPopup = $ionicPopup.alert({
                        title:'预定成功!',
                        okType:'button-balanced'
                    });
                }
            });

            $scope.postOpinion = function(opinion){
                //TODO:验证表单
                if(opinion == undefined){
                    //alert("请填写正确的信息");
                    var alertPopup1 = $ionicPopup.alert({
                        title:'请填写正确的信息!',
                        okType:'button-balanced'
                    });
                    return false;
                }
                if (!/^1\d{10}$/.test(opinion.phone)) {
                    //alert("请填写正确的手机号");
                    var alertPopup = $ionicPopup.alert({
                        title:'请填写正确的手机号!',
                        okType:'button-balanced'
                    });
                    return false;
                }
                if(!opinion.truename){
                    //alert("留下您的尊姓大名吧");
                    var alertPopup = $ionicPopup.alert({
                        title:'留下您的尊姓大名吧!',
                        okType:'button-balanced'
                    });
                    return false;
                }
                if(!opinion.content){
                    //alert("给点意见或者建议吧!");
                    var alertPopup = $ionicPopup.alert({
                        title:'给点意见或者建议吧!',
                        okType:'button-balanced'
                    });
                    return false;
                }
                Index.opinion(opinion);
            }

            $scope.postBook = function(book){
                //TODO:预定表单验证
                if(book == undefined){
                    //alert("请填写正确的信息");
                    var alertPopup = $ionicPopup.alert({
                        title:'请填写正确的信息!',
                        okType:'button-balanced'
                    });
                    return false;
                }
                if (!/^1\d{10}$/.test(book.phone)) {
                    //alert("请填写正确的手机号");
                    var alertPopup = $ionicPopup.alert({
                        title:'请填写正确的手机号!',
                        okType:'button-balanced'
                    });
                    return false;
                }
                if(!book.truename){
                    //alert("留下您的尊姓大名吧");
                    var alertPopup = $ionicPopup.alert({
                        title:'留下您的尊姓大名吧!',
                        okType:'button-balanced'
                    });
                    return false;
                }
                if(!book.content){
                    //alert("还没写您要预定的信息!");
                    var alertPopup = $ionicPopup.alert({
                        title:'还没写您要预定的信息!',
                        okType:'button-balanced'
                    });
                    return false;
                }
                Index.book(book);
            }
            //搜索功能
            $scope.searchKeyPress = function($event){
                if($event.keyCode == 13){
                    if($scope.search.content ==''){
                        //alert('您尚未输入任何信息!');
                        var alertPopup = $ionicPopup.alert({
                            title:'您尚未输入任何信息!',
                            okType:'button-balanced'
                        });
                        return false;
                    }

                    var keyword  =  encodeURIComponent(encodeURIComponent($scope.search.content));
                    $scope.search.content = '';
                    $state.go('search',{keyword:keyword},{ reload: true });
                }
            }

            $rootScope.$on('$stateChangeStart',
                function(event, toState, toParams, fromState, fromParams){
                    //if(toState.name == 'search'){
                    //    console.log('首页强制清除搜索结果本页面的缓存');
                    //    console.log(toState);
                    //    console.log($templateCache);
                    //
                    //    $templateCache.remove(toState.templateUrl);
                    //    //toState.cache = false;
                    //}


                }
            );

}])
;
