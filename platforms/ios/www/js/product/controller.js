//新品的控制器，不需要加载更多数据的功能
appControllers
.controller('NewProductCtrl',
[ '$scope', '$ionicLoading','$state','Product','Cart','Ds','$ionicPopup','$timeout','Login','$ionicHistory','$cordovaToast',
    function($scope,$ionicLoading,$state,Product,Cart,Ds,$ionicPopup,$timeout,Login,$ionicHistory,$cordovaToast){
        $ionicLoading.show({template: '加载中...'});
        $scope.productList = [];
        $scope.$on('product.found',function(event){
            $scope.productList = Product.productList;
            $ionicLoading.hide();
        });
        Product.query('order_type=4');

        $scope.$on('cart.add.ok',function($event){
            $cordovaToast.showShortBottom('恭喜,添加购物车成功!');

            var userLogined = $scope.user = {};
            if(Ds.has('user')){
                Login.getCart(Ds.get('user').userid);
            }

            $scope.$on('person.cart.success',function () {
                $scope.user = Ds.get('user');
            })
        });

        $scope.addToCart = function(product,$event){
            if(Ds.has('user')){
                var user = Ds.get('user');
                Cart.add(product.id,1,user.userid);
            }else{
                //TODO：提示登录
                $state.go('tab.person');
            }
            $event.stopPropagation();
        };

        //跳转至商品详情
        $scope.detail = function(product){
            //location.href="#/tab/product/"+product.id;
            $state.go('product-detail',{'productId':product.id});
            //location.href = "templates/product/product-detail.html?pid="+product.id;
        }
    }]);

//商品详情
appControllers
    .controller('ProductDetailCtrl',
    [ '$scope', '$ionicLoading','ProductDetail','$stateParams','$filter','$state','$ionicHistory','Ds','Cart','$ionicPopup','$timeout','Login','$cordovaToast',
    function($scope,$ionicLoading,ProductDetail,$stateParams,$filter,$state,$ionicHistory,Ds,Cart,$ionicPopup,$timeout,Login,$cordovaToast){
        $ionicLoading.show({template: '努力加载中...'});
        ProductDetail.productDetail($stateParams.productId);

        //ionic.Platform.ready(function () {
        //    if(ionic.Platform.isWebView() && $ionicConfig.views.swipeBackEnabled()){
        //        self.initSwipeBack();
        //    }
        //})

        //初始化页面广播监听
        $scope.$on('productDetail.init',function(event){
            $ionicLoading.hide();
            $filter('imgFilter')(ProductDetail.content);
            $scope.product = ProductDetail.content;
            $scope.product.oprice = $filter('formatNumber')(($scope.product.mprice-$scope.product.uprice),'#.000');
            if(Ds.has('user')){
                Login.getCart(Ds.get('user').userid);
            }
        });

        //减号
        $scope.sub = function(product){
            var cnt = product.cnt;
            if(cnt <= 0) return;
            product.cnt = cnt - 1;
        };
        //加号
        $scope.plus = function(product){
            var cnt = product.cnt;
            product.cnt = cnt + 1;
        };

        //立即购买
        $scope.buy_now = function(product){
            //location.href = "#/order"+product.id;
            $state.go('order',{'productId':product.id,'cnt':(product.cnt+1)});
        }

        //加入购物车
        $scope.into_cart = function(product,$event){
            if(Ds.has('user')){
                var user = Ds.get('user');
                Cart.add(product.id,product.cnt+1,user.userid);
            }else{
                //var alertPopup = $ionicPopup.alert({
                //    title:'请先登录!',
                //    okType:'button-balanced',okText:'确定'
                //});
                $cordovaToast.showShortBottom('请先登录!').then(function (success) {
                    $state.go('tab.person');
                })
            }
            //$event.stopPropagation();
        }

        $scope.$on('cart.add.ok', function (event) {
            var alertPopup = $ionicPopup.alert({
                title:'添加成功!',
                okType:'button-balanced',okText:'确定'
            });
            $timeout(function() {
                alertPopup.close();
            }, 1000);
        })

        //跳转至图文详情
        $scope.picDetail = function(product){
            //location.href = "http://192.168.88.104:8080/API/products/info?pid=3";
            //location.href="#/tab/pic/"+product.id;
            $state.go('pic-detail',{'picId':product.id});
        }

        //同类推荐
        $scope.same_class = function(product){
            $state.go('same-class',{'classId':product.classid});
        }

        //商品评论
        $scope.comment = function (product) {
            $state.go('comment',{'commentId':product.id});
        }

        //返回
        $scope.productDetail_back = function(){

            //console.log($ionicHistory.backView());
            //$ionicHistory.goBack();
            history.back();
            //$ionicHistory.nextViewOptions({
            //    disableAnimate:true
            //});
            //$ionicHistory.currentView($ionicHistory.backView());
            //if($ionicHistory.backView()!=null){
            //    if($ionicHistory.backView().backViewId!=null){
            //        console.log($ionicHistory.backView().stateName);
            //        if($ionicHistory.backView().stateName == 'product-detail')
            //        //$ionicHistory.goBack();
            //            history.back();
            //        else{
            //            console.log($ionicHistory.backView().stateName);
            //            $ionicHistory.goBack();
            //        }
            //    }else{
            //        history.back();
            //    }
            //}else{
            //    history.back();
            //}

        }

        //跳转至购物车
        $scope.to_cart = function () {
            $state.go('product-detail-cart');
        }

        $scope.user = {};
        if(!$scope.user.cartcnt){
            $scope.user.cartcnt = 0
        }

        $scope.$on('cart.add.ok',function () {
            if(Ds.has('user')){
                Login.getCart(Ds.get('user').userid);
            }
        })

        $scope.$on('person.cart.success',function () {
            $scope.user = Ds.get('user');
        })
    }]);

//图文详情
appControllers
    .controller('PicDetailCtrl',
    [ '$scope', '$ionicLoading','PicDetail','$stateParams','$ionicHistory','$timeout',
        function($scope,$ionicLoading,PicDetail,$stateParams,$ionicHistory,$timeout){
            $ionicLoading.show({template: '加载中...'});

            $timeout(function () {
                $ionicLoading.hide();
            }, 1);

            PicDetail.picDetail($stateParams.picId);

            //初始化页面广播监听
            $scope.$on('picDetail.init',function(event){
                $ionicLoading.hide();
                $scope.product = PicDetail.content;
                $scope.product_content = $scope.product.content;
            });

        //返回
        $scope.picDetail_back = function(){
            history.back();
        }
    }]);

//同类推荐
appControllers
    .controller('SameClassCtrl',
    [ '$scope', '$ionicLoading','SameClass','$stateParams','$ionicHistory','$state','Ds','Login','$cordovaToast','Cart',
        function($scope,$ionicLoading,SameClass,$stateParams,$ionicHistory,$state,Ds,Login,$cordovaToast,Cart){
            $ionicLoading.show({template: '加载中...'});
            $scope.productList = [];
            $scope.$on('sameclass.init',function(event){
                if(Ds.has('user')){
                    Login.getCart(Ds.get('user').userid);
                }
                $scope.productList = SameClass.productList;
                $ionicLoading.hide();
            });
            SameClass.sameclass($stateParams.classId);

            $scope.addToCart = function(product,$event){
                if(Ds.has('user')){
                    var user = Ds.get('user');
                    Cart.add(product.id,product.cnt+1,user.userid);
                }else{
                    $cordovaToast.showShortBottom('请先登录!').then(function (success) {
                        $state.go('tab.person');
                    })
                }
                $event.stopPropagation();
                return false;
            };

        //跳转至商品详情
        $scope.detail = function(product){
            //location.href="#/product/"+product.id;
            $state.go('product-detail',{productId:product.id})
        }

        //返回
        $scope.sameclass_back = function(){
            history.back();
        }

        //跳转至购物车
        $scope.to_cart = function () {
            $state.go('product-detail-cart');
        }

        $scope.user = {};
        if(!$scope.user.cartcnt){
            $scope.user.cartcnt = 0
        }

        $scope.$on('cart.add.ok',function () {
            if(Ds.has('user')){
                Login.getCart(Ds.get('user').userid);
            }
            $cordovaToast.showShortBottom('恭喜,添加购物车成功!');
        })

        $scope.$on('person.cart.success',function () {
            $scope.user = Ds.get('user');
        })
    }]);

//商品评论
appControllers
    .controller('CommentCtrl',
    [ '$scope', '$ionicLoading','Comment','$stateParams','$ionicHistory',
        function($scope,$ionicLoading,Comment,$stateParams,$ionicHistory){
            $ionicLoading.show({template: '加载中...'});
            $scope.commentList = [];
            $scope.$on('comment.init',function(event){
                $scope.commentList = Comment.commentList;
                $ionicLoading.hide();
            });
            Comment.comment($stateParams.commentId);

            //返回
            $scope.comment_back = function(){
                history.back();
            }
     }]);


//限时抢购
appControllers
    .controller('LimitCtrl',
    [ '$scope', '$ionicLoading','$stateParams','$ionicHistory','$state','Search','Cart','Ds','$ionicPopup','$timeout','Login','$cordovaToast',
        function($scope,$ionicLoading,$stateParams,$ionicHistory,$state,Search,Cart,Ds,$ionicPopup,$timeout,Login,$cordovaToast){
            $ionicLoading.show({template: '加载中...'});
            $scope.limitList = [];
            $scope.$on('limit.ready',function($event){
                $scope.limitList = Search.productList;
                $ionicLoading.hide();
            });
            Search.limit();

            //返回
            $scope.back = function(){
                history.back();
                //$ionicHistory.goBack();
            }

            $scope.$on('cart.add.ok',function($event){
                $cordovaToast.showShortBottom('恭喜,添加购物车成功!');
            });

            $scope.addToCart = function(product,$event){
                if(Ds.has('user')){
                    var user = Ds.get('user');
                    Cart.add(product.id,1,user.userid);
                }else{
                    //TODO：提示登录
                    $state.go('tab.person');
                }
                $event.stopPropagation();
            }

            //跳转至商品详情
            $scope.detail = function(product){
                $state.go('product-detail',{productId:product.id});

            }

            $scope.to_cart = function () {
                $state.go('product-detail-cart');
            }

            $scope.$on('cart.add.ok',function () {
                if(Ds.has('user')){
                    Login.getCart(Ds.get('user').userid);
                }
            })

            $scope.user = {};
            if(Ds.has()){
                Login.getCart(Ds.get('user').userid);
            }

            $scope.$on('person.cart.success',function () {
                $scope.user = Ds.get('user');
            })
        }]);
