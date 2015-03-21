allCotrollers
.controller('SearchCtrl',['$rootScope','$scope','$ionicHistory','SearchFoods','Ds', '$ionicModal','$ionicSlideBoxDelegate',
        function ($rootScope,$scope,$ionicHistory,SearchFoods,Ds,$ionicModal,$ionicSlideBoxDelegate) {
        $scope.cancel = function () {
            //history.back();
            $ionicHistory.goBack();
        }

        var lon = Ds.get('Longitude');
        var lat = Ds.get('Latitude');
        var userid = Ds.get('userid');

        $scope.fuzzy_search = function () {
            SearchFoods.search_food($scope.keyword,33,33,36);
        }

        //模糊搜索
        $scope.$on('search_food.success', function () {
            $scope.foodsList = SearchFoods.content;
        })

        $scope.exact_search = function (fid) {
            SearchFoods.search_restaurant(fid,33,33,36);
            $scope.modal.show();
        }

        $ionicModal.fromTemplateUrl('search_details.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal;
        });

        $scope.back = function () {
            $scope.modal.hide();
        }

        //精确搜索
        $scope.$on('search_restaurant.success', function () {
            $scope.restaurant_Detail = [];
            $scope.restaurant_Detail = SearchFoods.content.restaurant[0];

            $scope.foodList = [];

            var data = SearchFoods.content.foods;
            var amount = SearchFoods.content.total;
            var cnt = Math.ceil(amount/6);
            var foodList = [];
            for(var i=0,j=0; i<amount,j<cnt;i=i+6,j++){
                foodList[j]= {'food1':data[i],'food2':data[i+1],'food3':data[i+2],'food4':data[i+3],'food5':data[i+4],'food6':data[i+5]};
            }

            $scope.foodList = foodList;
            $ionicSlideBoxDelegate.update();

        })

    }])