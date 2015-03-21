/**
 * Created by iosdev2 on 15/3/6.
 */
allCotrollers
    .controller('MenuCtrl',
    [ '$rootScope','$scope','$ionicLoading','$ionicModal','$ionicPopup','Menu','Address','Tickets','Order','Ds','FoodInfo',
        function($rootScope,$scope,$ionicLoading,$ionicModal,$ionicPopup,Menu,Address,Tickets,Order,Ds,FoodInfo) {

            var userid = 114;
            var lon = Ds.get('Longitude');
            var lat = Ds.get('Latitude');
            //var userid = Ds.get('userid');

            $ionicLoading.show({template: '加载中...'});
            //查询myMenuCnt
            Menu.myMenuCnt(userid);
            Menu.myMenu(userid,1,1);
            $scope.listPanel = {top: '115px'};

            $scope.$on('menu.myMenuCnt',function(){
                $scope.cnt = Menu.cnt.rows;
                $ionicLoading.hide();
            });
            $scope.$on('menu.myMenu',function(){
                $scope.myMenu = Menu.content;
                //下拉框初始值
                $scope.orderInfo = {'to_id':$scope.myMenu.addressId,'book_time':'','tableware':'普通餐具','invoice_title':'不要发票'};
            });

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
            }

            //删除我的菜单
            $scope.remove = function(menu) {
                Menu.remove(menu,userid);
            }
            $scope.$on('menu.del',function($event,code){
                if(code ==0) {
                    $scope.cnt.cnt1 = $scope.cnt.cnt1 - 1;
                    var alertPopup = $ionicPopup.alert({
                        title:'删除成功!',
                        okType:'button-balanced'
                    });
                }
            });

            //买单
            $scope.order = function(){
                $ionicModal.fromTemplateUrl('order.html', {
                    scope: $scope,
                    animation: 'slide-in-left'
                }).then(function(orderModal) {
                    $scope.orderModal = orderModal;
                    $scope.orderModal.show();
                });
            }
            $scope.order_back = function(){
                $scope.orderModal.hide();
            }

            //新增就餐地址页面 By Jack
            $scope.addAddress = function(){
                $ionicModal.fromTemplateUrl('addAddress.html', {
                    scope: $scope,
                    animation: 'slide-in-up'
                }).then(function(addAddressModal) {
                    $scope.addAddressModal = addAddressModal;
                    $scope.addAddressModal.show();
                });
            }
            $scope.addAddress_back = function(){
                $scope.addAddressModal.hide();
            }
            //新增就餐地址 By Jack
            $scope.postAddAddress = function(addressInfo){
                if(addressInfo == undefined){
                    var alertPopup = $ionicPopup.alert({
                        title:'请填写正确的信息!',
                        okType:'button-balanced'
                    });
                    return false;
                }
                if(!addressInfo.to_name){
                    var alertPopup = $ionicPopup.alert({
                        title:'还没写收件人的姓名!',
                        okType:'button-balanced'
                    });
                    return false;
                }
                if (!/^1\d{10}$/.test(addressInfo.to_phone)) {
                    var alertPopup = $ionicPopup.alert({
                        title:'请填写正确的手机号!',
                        okType:'button-balanced'
                    });
                    return false;
                }
                if(!addressInfo.to_addr){
                    var alertPopup = $ionicPopup.alert({
                        title:'还没写收件人的收货地址!',
                        okType:'button-balanced'
                    });
                    return false;
                }
                $scope.myMenu.address = addressInfo;
                Address.add(addressInfo,userid);
            }
            $scope.$on('address.add',function($event,code){
                if(code ==0) {
                    var alertPopup = $ionicPopup.alert({
                        title:'新增地址成功!',
                        okType:'button-balanced'
                    });
                }
                Address.all(userid);
                $scope.$on('address.show',function(){
                    $scope.addresses = Address.content.rows;
                });
                if($scope.addAddressModal){
                    $scope.addAddressModal.remove();
                }
            });

            //选取配送地址
            Address.all(userid);
            $scope.$on('address.show',function(){
                $scope.addresses = Address.content.rows;
            });
            $scope.showAddress = function (){
                $ionicModal.fromTemplateUrl('chooseAddress.html', {
                    scope: $scope,
                    animation: 'slide-in-left'
                }).then(function(chooseAddressModal) {
                    $scope.chooseAddressModal = chooseAddressModal;
                    $scope.chooseAddressModal.show();
                });
            }
            $scope.chooseAddress_back = function(){
                $scope.chooseAddressModal.hide();
            }
            $scope.chooseAddress = function(address){
                $scope.chooseAddressModal.remove();
                $scope.myMenu.address = address.to_addr +','+ address.to_name +','+ address.to_phone;
            }

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
                $scope.updateModal.hide();
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

            $scope.removeAddress = function(address) {
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


            //预约时间
            var d = new Date();
            $scope.lacalDate = d.getFullYear()+"-"+((d.getMonth()+1)<10?"0":"")+(d.getMonth()+1)+"-"+(d.getDate()<10?"0":"")+d.getDate()+" "+ (d.getHours()+2<10?"0":"")+(d.getHours()+2)+":"+(d.getMinutes()<10?"0":"")+d.getMinutes()+":"+ (d.getSeconds()<10?"0":"")+d.getSeconds();
            $scope.booktime=function(){
                $scope.o = {'bookDate':$scope.lacalDate};
                var myPopup = $ionicPopup.show({
                    //template: '<input type="text" style="text-align: center " ng-model="o.bookDate" >',
                    template: '<input type="date" style="text-align: center " class="width-100" ><input type="time" style="text-align: center " class="width-100">',
                    title: '预约到达时间',
                    //subTitle: '请输入0-99的数字',
                    scope: $scope,
                    buttons: [
                        {
                            text: '<b>确认</b>',
                            type: 'button-positive',
                            onTap: function() {
                                //alert($scope.o.bookDate);
                                var _reTimeReg = /^(?:19|20)[0-9][0-9]-(?:(?:0[1-9])|(?:1[0-2]))-(?:(?:[0-2][1-9])|(?:[1-3][0-1])) (?:(?:[0-2][0-3])|(?:[0-1][0-9])):[0-5][0-9]:[0-5][0-9]$/;
                                if(!_reTimeReg.test($scope.o.bookDate)){
                                    alert("预约时间格式应为yyyy-MM-dd HH:mm:ss");
                                    return false;
                                }
                                $scope.lacalDate = $scope.o.bookDate;
                            }
                        }
                    ]
                });
            }


            //选择发票
            Tickets.all(userid);
            $scope.$on('tickets.mytickets',function(){
                $scope.tickets = Tickets.content.rows;
            });
            $scope.showInvoice = function (){
                $ionicModal.fromTemplateUrl('chooseInvoice.html', {
                    scope: $scope,
                    animation: 'slide-in-left'
                }).then(function(chooseInvoiceModal) {
                    $scope.chooseInvoiceModal = chooseInvoiceModal;
                    $scope.chooseInvoiceModal.show();
                });
            }
            $scope.chooseInvoice_back = function(){
                $scope.chooseInvoiceModal.hide();
            }
            $scope.chooseInvoice = function(tickct){
                $scope.chooseInvoiceModal.remove();
                $scope.orderInfo.invoice_title = tickct.invoice_title;
            }

            //新增发票抬头页面 By Jack
            $scope.addInvoice = function(){
                $ionicModal.fromTemplateUrl('addInvoice.html', {
                    scope: $scope,
                    animation: 'slide-in-left'
                }).then(function(addInvoiceModal) {
                    $scope.addInvoiceModal = addInvoiceModal;
                    $scope.addInvoiceModal.show();
                });
            }
            $scope.addInvoice_back = function(){
                $scope.addInvoiceModal.hide();
            }
            //新增发票抬头 By Jack
            $scope.postAddInvoice = function(ticket){
                if(ticket == undefined){
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
                if($scope.addInvoiceModal){
                    $scope.addInvoiceModal.remove();
                }
            });

            //编辑发票抬头页面 By Jack
            $scope.updateInvoice = function(ticket){
                $ionicModal.fromTemplateUrl('updateInvoice.html', {
                    scope: $scope,
                    animation: 'slide-in-up'
                }).then(function(updatemodal) {
                    $scope.ticket_title = ticket.invoice_title;
                    $scope.ticket = ticket;
                    $scope.updateInvoiceModal = updatemodal;
                    $scope.updateInvoiceModal.show();
                });
            }
            $scope.updateInvoice_back = function(){
                $scope.updateInvoiceModal.hide();
            }
            //编辑发票抬头 By Jack
            $scope.postUpdateInvoice = function(ticket_title){
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
                if($scope.updateInvoiceModal){
                    $scope.updateInvoiceModal.remove();
                }
                if(code ==0) {
                    var alertPopup = $ionicPopup.alert({
                        title:'修改发票成功!',
                        okType:'button-balanced'
                    });
                }
            });

            $scope.removeInvoice = function(ticket) {
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


            //提交订单
            $scope.postOrder = function (){
                //alert(orderInfo.to_id);
                $scope.orderInfo.book_time = $scope.lacalDate;
                //for(o in $scope.orderInfo){
                //    alert($scope.orderInfo[o]);
                //}
                Order.postOrder($scope.orderInfo,userid);
            }

            //待付款订单页面
            Order.menuByDfk(userid,1,1);
            $scope.$on('order.menuByDfk',function(){
                $scope.menuByDfks = Order.content.rows;
                for(var o in $scope.menuByDfks){
                    $scope.menuByDfks[o].create_date = $scope.getOrderTime($scope.menuByDfks[o].create_date);
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
            //取消订单
            $scope.cancleOrder = function(dfkOrder) {
                Order.cancle(dfkOrder,userid);
            }
            $scope.$on('order.cancle',function($event,code){
                if(code ==0) {
                    Order.menuByDfk(userid,1,1);
                    var alertPopup = $ionicPopup.alert({
                        title:'取消成功!',
                        okType:'button-balanced'
                    });
                }
            });

            //订单详情页面
            $scope.menuDetialInfo = function (dfkInfo){
                Order.menuByDfkInfo(dfkInfo,userid,1,1);
                $scope.$on('order.menuByDfkInfo',function(){
                    $scope.dfkInfos = Order.content.rows;
                });
                $ionicModal.fromTemplateUrl('menuByDfkInfo.html', {
                    scope: $scope,
                    animation: 'slide-in-left'
                }).then(function(menuByDfkInfoModal) {
                    $scope.menuByDfkInfoModal = menuByDfkInfoModal;
                    $scope.menuByDfkInfoModal.show();
                });
            }
            $scope.menuByDfkInfo_back = function(){
                $scope.menuByDfkInfoModal.remove();
            }


             //付款
             $scope.payOrder = function (menuByDfk){
                YFPay.alipay(function(){alert('ok');},
                          function(){alert('error');},
                          [menuByDfk.orderno,//订单号
                           'YFPay',//支付subject
                           'YFPay',//支付body
                           '0.01']//金额
                          );
             }

            //已付款订单页面
            Order.menuByYfk(userid,1,1);
            $scope.$on('order.menuByYfk',function(){
                $scope.menuByYfks = Order.yfkContent.rows;
                for(var o in $scope.menuByYfks){
                    switch ($scope.menuByYfks[o].status){
                        case '1':
                            $scope.menuByYfks[o].status = "订单取消";
                        case '1000':
                            $scope.menuByYfks[o].status = "订单创建";
                        case '2000':
                            $scope.menuByYfks[o].status = "已付款，待烹饪";
                        case '3000':
                            $scope.menuByYfks[o].status = "烹饪开始";
                        case '4000':
                            $scope.menuByYfks[o].status = "烹饪结束";
                        case '5000':
                            $scope.menuByYfks[o].status = "派送中";
                        case '6000':
                            $scope.menuByYfks[o].status = "已签收";
                        case '7000':
                            $scope.menuByYfks[o].status = "已评价";
                    }
                    $scope.menuByYfks[o].create_date = $scope.getOrderTime($scope.menuByYfks[o].create_date);
                }
            });

            //评价表单
            $scope.pjOrder = function (menuByYfk){
                $scope.pjwd = 5;
                $scope.pjfw = 5;
                $scope.pjkd = 5;
                $scope.pjMenuByYfk_no = menuByYfk.orderno;
                $ionicModal.fromTemplateUrl('postPj.html', {
                    scope: $scope,
                    animation: 'slide-in-left'
                }).then(function(pjOrderModal) {
                    $scope.pjOrderModal = pjOrderModal;
                    $scope.pjOrderModal.show();
                });
            }
            $scope.pjOrder_back = function(){
                $scope.pjOrderModal.remove();
            }
            $scope.postPj = function (pjInfocontent){
                if(!pjInfocontent){
                    $ionicPopup.alert({
                        title:'评价内容不能为空!',
                        okType:'button-balanced'
                    });
                    return false;
                }
                var info = {};
                info.flag = 1;
                info.uid = userid;
                info.orderno = $scope.pjMenuByYfk_no;
                info.logi_lev = $scope.pjkd;
                info.desc_lev = $scope.pjwd;
                info.serv_lev = $scope.pjfw;
                info.content = pjInfocontent;
                Order.addOrderComment(info);
            }
            $scope.$on('order.addOrderComment',function($event,code){
                Menu.myMenuCnt(userid);
                Order.menuByYfk(userid,1,1);
                if($scope.pjOrderModal){
                    $scope.pjOrderModal.remove();
                }
                if(code ==0) {
                    var alertPopup = $ionicPopup.alert({
                        title:'订单评价成功!',
                        okType:'button-balanced'
                    });
                }
            });

            //已评价订单页面
            Order.menuByYpj(userid,1,1);
            $scope.$on('order.menuByYpj',function(){
                $scope.menuByYpjs = Order.content.rows;
                for(var o in $scope.menuByYpjs){
                    $scope.menuByYpjs[o].create_date = $scope.getOrderTime($scope.menuByYpjs[o].create_date);
                }
            });

        }]);