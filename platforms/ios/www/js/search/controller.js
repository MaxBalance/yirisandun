appControllers
.controller('SearchCtrl',
    [ '$templateCache','$rootScope','$scope', '$ionicLoading','$ionicModal','$stateParams','$ionicHistory','$state','Search','Cart','Ds','$ionicPopup','$ionicTabsDelegate','$timeout','Login',
        function($templateCache,$rootScope,$scope,$ionicLoading,$ionicModal,$stateParams,$ionicHistory,$state,Search,Cart,Ds,$ionicPopup,$ionicTabsDelegate,$timeout,Login){

            $scope.back = function(){
                history.back();
            }
            //$scope.listPanel = {height:'370px'};


            var tag = 'asc';
            function init(){
                //$ionicLoading.show({template: '加载中...'});
                var keyword = decodeURIComponent(decodeURIComponent($stateParams.keyword));
                switch (keyword){
                    case 'zao':
                        //定义查询条件
                        $scope.search = {type:2,class_id:'zao'
                            ,userid:0,order_type:1,tag:'asc',curpage:1};
                        break;
                    case 'zhong':
                        //定义查询条件
                        $scope.search = {type:2,class_id:'zhong'
                            ,userid:0,order_type:1,tag:'asc',curpage:1};
                        break;
                    case 'wan':
                        //定义查询条件
                        $scope.search = {type:2,class_id:'wan'
                            ,userid:0,order_type:1,tag:'asc',curpage:1};
                        break;
                    case 'tuijian':
                        $scope.search = {type:2,class_id:'tuijian'
                            ,userid:0,order_type:1,tag:'asc',curpage:1};
                        break;
                    case 'youxuan':
                        $scope.search = {type:2,class_id:'top'
                            ,userid:0,order_type:1,tag:'asc',curpage:1};
                        break;
                    default :
                        //品牌推荐
                        if($stateParams.keyword.indexOf('brand_')==0){
                            var id = $stateParams.keyword.substring(6);
                            $scope.search = {type:5,search_name:'',b_id:id
                                ,userid:0,order_type:1,tag:'asc',curpage:1};

                        }//商品分类
                        else if($stateParams.keyword.indexOf('category_')==0){
                            var id = $stateParams.keyword.substring(9);
                            $scope.search = {type:4,search_name:'',class_id:id
                                ,userid:0,order_type:1,tag:'asc',curpage:1};

                        }else{
                            //定义查询条件
                            $scope.search = {type:3,search_name:$stateParams.keyword,content:keyword
                                ,userid:0,order_type:1,tag:'asc',curpage:1};
                        }
                }

                //定义4组list
                //元素分别是一个数组
                $scope.productList = {
                    l1:{pages:1,rows:[],hasMore:false},
                    l2:{pages:1,rows:[],hasMore:false},
                    l3:{pages:1,rows:[],hasMore:false},
                    l4:{pages:1,rows:[],hasMore:false}
                };
                //执行搜索功能

                for(var i = 1;i<5;i++){
                    (function(i,condition){
                        condition.order_type =i;
                        Search.search(condition);
                    })(i,$scope.search);
                }
            };
            init();

            //$scope.change = function (index) {
                //if(tag == 'asc'){
                //    tag = 'desc';
                //}else{
                //    tag = 'asc';
                //}
                //alert($ionicTabsDelegate.selectedIndex())
                ////执行搜索功能
                //(function(condition){
                //    alert($scope.search.class_id)v
                //condition.order_type =2;
                //    condition.tag = tag;
                //Search.search(condition);
                //})($scope.search);
                //$timeout(function () {
                //    $ionicTabsDelegate.select(index);
                //},100)
            //}

            $scope.$on('search.ready',function($event,data){
                if(Search.productList.length<1){
                    $scope.productList['l'+data].hasMore = false;
                    //$ionicLoading.hide();
                    return;
                }
                if(Search.productList.length>9){
                    $scope.productList['l'+data].hasMore = true;
                }else{
                    $scope.productList['l'+data].hasMore = false;
                }
                var page = $scope.productList['l'+data].pages;
                page++;
                $scope.productList['l'+data].pages = page;
                var rows = $scope.productList['l'+data].rows;
                rows = rows.concat(Search.productList);
                $scope.productList['l'+data].rows = rows;
                $ionicLoading.hide();

            });

            $scope.moreDataCanBeLoaded = function(type){
                return $scope.productList['l'+type].hasMore;
            }

            //搜索功能
            $scope.searchKeyPress = function($event){
                if($event.keyCode == 13){
                    $state.go('.',{keyword:$scope.search.content});
                    $stateParams.keyword = $scope.search.content;
                    init();

                }
            }


            //加载更多
            $scope.loadMoreProduct = function(type){
                $scope.search.curpage = $scope.productList['l'+type].pages+1;
                $scope.search.order_type = type;
                Search.search($scope.search);
            }


            //进入详情页面
            $scope.detail = function(product){
                $state.go('product-detail',{productId:product.id});
            }



            //加入购物车
            $scope.addToCart = function(product,$event){
                if(Ds.has('user')){
                    var user = Ds.get('user');
                    Cart.add(product.id,1,user.userid);
                }else{
                    $state.go('tab.person');
                }
                $event.stopPropagation();
            }

            $scope.$on('cart.add.ok',function(event){
                var alertPopup = $ionicPopup.alert({
                    title:'添加成功!',
                    okType:'button-balanced',okText:'确定'
                });
            });

            $rootScope.$on('$stateChangeStart',
                function(event, toState, toParams, fromState, fromParams){
                    if(toState.name=='search'&& fromState.name =='tab.home'){
                        $stateParams.keyword = toParams.keyword;
                        init();
                    }
                    if(toState.name=='search'&& fromState.name =='tab.category'){
                        $stateParams.keyword = toParams.keyword;
                        init();
                    }
                }
            );

            $scope.to_cart = function () {
                $state.go('product-detail-cart');
            }

            $scope.user = {};
            Login.getCart(Ds.get('user').userid);

            $scope.$on('cart.add.ok',function () {
                if(Ds.has('user')){
                    Login.getCart(Ds.get('user').userid);
                }
            })

            $scope.$on('person.cart.success',function () {
                $scope.user = Ds.get('user');
            })
}])
;
