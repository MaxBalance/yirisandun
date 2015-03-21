/**
 * Created by iosdev2 on 15/3/14.
 */
allCotrollers
    .controller('GuideCtrl',
    [ '$rootScope','$scope','Ds','$state',
        function($rootScope,$scope,Ds,$state) {
            Ds.set('guide',true);

        $scope.runApp = function(){
            $state.go('app.main');
        }

        }]);