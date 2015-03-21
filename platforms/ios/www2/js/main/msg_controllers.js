allCotrollers
.controller('MsgCtrl',['$rootScope','$scope','$ionicSideMenuDelegate','$ionicModal','$state','Ds','Message','$stateParams',
        function ($rootScope, $scope, $ionicSideMenuDelegate, $ionicModal, $state, Ds,Message,$stateParams) {
            var init = function () {
                Message.init($stateParams.uid);
            }

            init();

            $scope.$on('message.load',function(){
                $scope.messageList = Message.content.rows;
            })

            var msg = Message.content.rows;

            //跳转至消息详情
            $scope.msg_detail = function (message) {
                $scope.modal.show();
                $scope.msg_details = message;

                //更改已读状态
                Message.read(Ds.get('userid'),message.id);
            }

            $ionicModal.fromTemplateUrl('msg_detail.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.modal = modal;
            });

            $scope.back = function () {
                $scope.modal.hide();
            }

            $scope.$on('modal.hidden', function () {
                init();
            })


    }])