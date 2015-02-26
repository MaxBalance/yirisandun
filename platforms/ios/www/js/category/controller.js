appControllers
.controller('CategoryCtrl', ['$scope','$ionicLoading','Category',function($scope,$ionicLoading,Category) {
        $ionicLoading.show({template: '加载中...'});

        Category.query();

        $scope.$on('category.init',function(){
            $scope.categoryList = Category.categoryList;
            $ionicLoading.hide();
        });

}])
;
