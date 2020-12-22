angular.module('brdr.controllers').controller(
    'RegistroCtrl',
    [
        '$scope',
        '$ionicPopup',
        '$state',
        'Auth',
        'Response',
        '$ionicLoading',
        function($scope, $ionicPopup, $state, Auth, Response, $ionicLoading) {

            /**
             * Registro de usuarios
             *
             * @param {user} 
             * @returns {array}
             */
            $scope.registro = function(user) {

                $('span.error').remove();
                $('*.error').removeClass('error');

                $ionicLoading.show({
                    template: 'Cargando...',
                })

                Auth.registro(user).then(function(rta) {
                  if (rta.success) {
                      $state.go('login');    
                  } else {
                    Response.error(rta);
                  }

                  $ionicLoading.hide();
                });
            }
        }
    ]
);