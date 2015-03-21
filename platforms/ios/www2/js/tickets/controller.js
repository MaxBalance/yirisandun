/**
 * Created by iosdev2 on 15/3/5.
 */
allCotrollers
    .controller('TicketsCtrl',
    [ '$rootScope','$scope','$ionicLoading','$ionicModal','Tickets','$ionicPopup','Ds','$state',
        function($rootScope,$scope,$ionicLoading,$ionicModal,Tickets,$ionicPopup,Ds,$state) {

            var userid = 114;
            //var userid = Ds.get("userid");

            Tickets.all(userid);
            $ionicLoading.show({template: '加载中...'});
            $scope.$on('tickets.mytickets',function(){
                $scope.tickets = Tickets.content.rows;
                for(var o in $scope.tickets){
                    $scope.tickets[o].create_date = $scope.getOrderTime($scope.tickets[o].create_date);
                }
                $ionicLoading.hide();
            });

            //新增发票抬头页面 By Jack
            $scope.addInvoice = function(){
                $ionicModal.fromTemplateUrl('addInvoice.html', {
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
                    location.href="#/app/tickets";
                };
            }
            //新增发票抬头 By Jack
            $scope.postAddInvoice = function(ticket){
                if(ticket == undefined){
                    //alert("请填写正确的信息");
                    var alertPopup = $ionicPopup.alert({
                        title:'请填写正确的信息!',
                        okType:'button-balanced'
                    });
                    return false;
                }
                if(!ticket.title){
                    var alertPopup = $ionicPopup.alert({
                        title:'还没写您的发票抬头!',
                        okType:'button-balanced'
                    });
                    return false;
                }
                Tickets.add(ticket,userid);
            }

            $scope.$on('ticket.add',function($event,code){
                if(code ==0) {
                    var alertPopup = $ionicPopup.alert({
                        title:'新增发票成功!',
                        okType:'button-balanced'
                    });
                    Tickets.all(userid);
                }
                       if($scope.addModal){
                       $scope.addModal.remove();
                       }
            });

            //编辑发票抬头页面 By Jack
            $scope.update = function(ticket){
                $ionicModal.fromTemplateUrl('update.html', {
                    scope: $scope,
                    animation: 'slide-in-up'
                }).then(function(updatemodal) {
                    $scope.ticket_title = ticket.invoice_title;
                    $scope.ticket = ticket;
                    $scope.updateModal = updatemodal;
                    $scope.updateModal.show();
                });
            }
            $scope.update_back = function(){
                $scope.updateModal.hide();
            }
            //$scope.ticket_title = "ok";
            //编辑发票抬头 By Jack
            $scope.postUpdate = function(ticket_title){
                //alert($scope.ticket_title);
                if($scope.ticket_title == undefined){
                    var alertPopup = $ionicPopup.alert({
                        title:'请填写正确的信息!',
                        okType:'button-balanced'
                    });
                    return false;
                }
                $scope.ticket.invoice_title = ticket_title;
                if(!$scope.ticket.invoice_title){
                    var alertPopup = $ionicPopup.alert({
                        title:'还没写您的发票抬头!',
                        okType:'button-balanced'
                    });
                    return false;
                }
                Tickets.update($scope.ticket);
            }
            $scope.$on('ticket.update',function($event,code){
                if($scope.updateModal){
                    $scope.updateModal.remove();
                }
                if(code ==0) {
                    var alertPopup = $ionicPopup.alert({
                        title:'修改发票成功!',
                        okType:'button-balanced'
                    });
                }
            });

            $scope.remove = function(ticket) {
                Tickets.remove(ticket);
            }
            $scope.$on('ticket.del',function($event,code){
                if(code ==0) {
                    var alertPopup = $ionicPopup.alert({
                        title:'删除成功!',
                        okType:'button-balanced'
                    });
                }
            });

            $scope.getOrderTime = function(nS) {
                var time = new Date(parseInt(nS) * 1000);
                var year = time.getFullYear();
                var month = time.getMonth()+1;
                var date = time.getDate();
                var hour = time.getHours();
                var minute = time.getMinutes();
                var second = time.getSeconds();
                return year+"-"+month+"-"+date+" "+hour+":"+minute+":"+second;
            }
        }]);