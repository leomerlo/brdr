angular.module('brdr.controllers').controller('UserCtrl',
    [
        '$scope',
        '$state',
        '$stateParams',
        'PerfilService',
        'Response',
        'API_SERVER',
        'IMAGE_FOLDER',
        '$ionicPopup',
        function($scope, $state, $stateParams, PerfilService, Response, API_SERVER, IMAGE_FOLDER, $ionicPopup) {

            $scope.user = [];

            $scope.$on('$ionicView.beforeEnter', function() {
              $scope.disable = true;

              PerfilService.getUserInfo($stateParams.id).then(function(rta) {
                if(rta.success){
                    $scope.user = rta.data.message;
                    $scope.user.imagen = IMAGE_FOLDER + 'users/' + $scope.user.id + '.jpg';
                    $scope.title = $scope.user.usuario;
                } else {
                    Response.error(rta);
                }
              });

            });

            $scope.agregarAmigo = function(){
              PerfilService.agregarAmigo($stateParams.id).then(function(rta) {
                if (rta.success) {
                    $state.go('tab.amigos');
                } else {
                    Response.error(rta);
                }
              });
            }

            $scope.eliminarAmigo = function(){
              PerfilService.eliminarAmigo($stateParams.id).then(function(rta) {
                if (rta.success) {
                    $state.go('tab.feed');
                } else {
                    Response.error(rta);
                }
              });
            }
        }
    ]    
);