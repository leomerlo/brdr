angular.module('brdr.controllers').controller('AmigosCtrl',
    [
        '$scope',
        '$state',
        'Auth',
        'Storage',
        'Response',
        'API_SERVER',
        'IMAGE_FOLDER',
        'PerfilService',
        function($scope, $state, Auth, Storage, Response, API_SERVER, IMAGE_FOLDER,PerfilService) {

            $scope.$on('$ionicView.beforeEnter', function() {

                $scope.nuance = new Date().getTime();
                $scope.imgFolder = IMAGE_FOLDER + 'users';

                PerfilService.amigos().then(function(rta) {
                    if(rta.success){
                        $scope.amigos = rta.data.message;
                    } else {
                        Response.error(rta);
                    }
                });

            });

        }
    ]    
);