/**
 * Created by iosdev2 on 15/3/6.
 */
allCotrollers
    .controller('AddressCtrl',
    [ '$rootScope','$scope','$ionicLoading','$ionicModal','Address','$ionicPopup','Ds','$state',
        function($rootScope,$scope,$ionicLoading,$ionicModal,Address,$ionicPopup,Ds,$state) {

            var userid = 114;
            //var userid = Ds.get("userid");
            Address.all(userid);

            $ionicLoading.show({template: '加载中...'});
            $scope.$on('address.show',function(){
                //alert(Address.content.rows[0].to_addr);
                $scope.addresses = Address.content.rows;
                $ionicLoading.hide();
            });

            //新增就餐地址页面 By Jack
            $scope.add = function(){
                $ionicModal.fromTemplateUrl('add.html', {
                    scope: $scope,
                    animation: 'slide-in-up'
                }).then(function(addmodal) {
                    $scope.addModal = addmodal;
                    $scope.addModal.show();
                });
            }
            $scope.add_back = function(){
                $scope.addModal.hide().then()
                {
                    location.href="#/app/address";
                };
            }
            //新增就餐地址 By Jack
            $scope.addressInfo = {'to_name':'','to_phone':'','to_addr':''};
            $scope.postAdd = function(){
                if($scope.addressInfo == undefined){
                    var alertPopup = $ionicPopup.alert({
                        title:'请填写正确的信息!',
                        okType:'button-balanced'
                    });
                    return false;
                }
                if(!$scope.addressInfo.to_name){
                    var alertPopup = $ionicPopup.alert({
                        title:'还没写收件人的姓名!',
                        okType:'button-balanced'
                    });
                    return false;
                }
                if (!/^1\d{10}$/.test($scope.addressInfo.to_phone)) {
                    var alertPopup = $ionicPopup.alert({
                        title:'请填写正确的手机号!',
                        okType:'button-balanced'
                    });
                    return false;
                }
                if(!$scope.addressInfo.to_addr){
                    var alertPopup = $ionicPopup.alert({
                        title:'还没写收件人的收货地址!',
                        okType:'button-balanced'
                    });
                    return false;
                }
                Address.add($scope.addressInfo,userid);
            }
            $scope.$on('address.add',function($event,code){
                if(code ==0) {
                    Address.all(userid);
                    $scope.addressInfo.to_name = '';
                    $scope.addressInfo.to_phone = '';
                    $scope.addressInfo.to_addr = '';
                    var alertPopup = $ionicPopup.alert({
                        title:'新增地址成功!',
                        okType:'button-balanced'
                    });
                }
                if($scope.addModal){
                    $scope.addModal.remove();
                }
            });

            //编辑就餐地址页面 By Jack
            $scope.update = function(address){
                $ionicModal.fromTemplateUrl('updaddress.html', {
                    scope: $scope,
                    animation: 'slide-in-up'
                }).then(function(updatemodal) {
                    $scope.address = address;
                    $scope.address_toname = address.to_name;
                    $scope.address_toaddr = address.to_addr;
                    $scope.address_tophone = address.to_phone;
                    $scope.updateModal = updatemodal;
                    $scope.updateModal.show();
                });
            }
            $scope.update_back = function(){
                $scope.updateModal.remove();
            }

            //编辑就餐地址 By Jack
            $scope.postUpdate = function(address_toname,address_tophone,address_toaddr){
                if($scope.address == undefined){
                    //alert("请填写正确的信息");
                    var alertPopup = $ionicPopup.alert({
                        title:'请填写正确的信息!',
                        okType:'button-balanced'
                    });
                    return false;
                }
                $scope.address.to_name = address_toname;
                if(!$scope.address.to_name){
                    var alertPopup = $ionicPopup.alert({
                        title:'还没写收件人的姓名!',
                        okType:'button-balanced'
                    });
                    return false;
                }
                $scope.address.to_phone = address_tophone;
                if (!/^1\d{10}$/.test($scope.address.to_phone)) {
                    var alertPopup = $ionicPopup.alert({
                        title:'请填写正确的手机号!',
                        okType:'button-balanced'
                    });
                    return false;
                }
                $scope.address.to_addr = address_toaddr;
                if(!$scope.address.to_addr){
                    var alertPopup = $ionicPopup.alert({
                        title:'还没写收件人的收货地址!',
                        okType:'button-balanced'
                    });
                    return false;
                }
                Address.update($scope.address);
            }
            $scope.$on('address.update',function($event,code){
                if($scope.updateModal){
                    $scope.updateModal.remove();
                }
                if(code ==0) {
                    var alertPopup = $ionicPopup.alert({
                        title:'修改地址成功!',
                        okType:'button-balanced'
                    });
                }
            });

            $scope.remove = function(address) {
                Address.remove(address);
            }
            $scope.$on('address.del',function($event,code){
                if(code ==0) {
                    var alertPopup = $ionicPopup.alert({
                        title:'删除成功!',
                        okType:'button-balanced'
                    });
                }
            });

        }]);