angular.module('brdr.controllers').controller('MensajesCtrl',
    [
        '$scope',
        '$state',
        'Auth',
        'Storage',
        'Response',
        'API_SERVER',
        'IMAGE_FOLDER',
        'MensajesService',
        function($scope, $state, Auth, Storage, Response, API_SERVER, IMAGE_FOLDER,MensajesService) {

            $scope.$on('$ionicView.beforeEnter', function() {

                $scope.nuance = new Date().getTime();
                $scope.imgFolder = IMAGE_FOLDER + 'users';
                $scope.user = Storage.get('userData');

                MensajesService.conversaciones().then(function(rta) {
                    if(rta.success){
                        $scope.conversaciones = rta.data.message;
                        for(i in $scope.conversaciones){

                            if($scope.conversaciones[i]['emisor']['id'] == $scope.user.id){
                                $scope.conversaciones[i]['conv_id'] = $scope.conversaciones[i]['receptor']['id'];
                                $scope.conversaciones[i]['nombre'] = $scope.conversaciones[i]['receptor']['usuario'];
                            } else {
                                $scope.conversaciones[i]['conv_id'] = $scope.conversaciones[i]['emisor']['id'];
                                $scope.conversaciones[i]['nombre'] = $scope.conversaciones[i]['emisor']['usuario'];
                            }
                        }
                    } else {
                        Response.error(rta);
                    }
                });

            });

        }
    ]    
);